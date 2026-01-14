import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// Esquema de validación con Zod para entrada de datos
export const UserValidationSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .trim(),
  email: z.string()
    .email('Formato de email inválido')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres'),
});

// Esquema para login (sin nombre)
export const LoginValidationSchema = UserValidationSchema.omit({ nombre: true });

// Tipos TypeScript derivados de Zod
export type UserInput = z.infer<typeof UserValidationSchema>;
export type LoginInput = z.infer<typeof LoginValidationSchema>;

// Interface para el documento de MongoDB
export interface IUser extends Document {
  nombre: string;
  email: string;
  password: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  
  // Métodos de instancia
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  toJSON(): Partial<IUser>;
}

// Esquema de Mongoose
const userSchema = new Schema<IUser>({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email: string) {
        // Validación adicional de email con regex
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Formato de email inválido'
    }
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    maxlength: [100, 'La contraseña no puede exceder 100 caracteres']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
  versionKey: false // Elimina el campo __v
});

// Índices para optimización de consultas
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ createdAt: -1 });
userSchema.index({ isActive: 1 });

// Middleware pre-save para hash de contraseña
userSchema.pre('save', async function(next) {
  try {
    // Solo hashear si la contraseña fue modificada
    if (!this.isModified('password')) {
      return next();
    }

    // Generar salt y hashear contraseña
    const saltRounds = 12; // Nivel de seguridad alto
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
    
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error al comparar contraseñas');
  }
};

// Método para generar JWT token
userSchema.methods.generateAuthToken = function(): string {
  try {
    const payload = {
      userId: this._id,
      email: this.email,
      nombre: this.nombre
    };
    
    // Usar variable de entorno para el secreto JWT
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    
    return jwt.sign(payload, secret, {
      expiresIn: '7d', // Token válido por 7 días
      issuer: 'librosyreview',
      audience: 'librosyreview-users'
    });
  } catch (error) {
    throw new Error('Error al generar token de autenticación');
  }
};

// Método toJSON personalizado para no exponer la contraseña
userSchema.methods.toJSON = function(): Partial<IUser> {
  const userObject = this.toObject();
  
  // Eliminar campos sensibles
  delete userObject.password;
  
  return userObject;
};

// Método estático para validar datos de entrada
userSchema.statics.validateUserInput = function(data: unknown) {
  return UserValidationSchema.parse(data);
};

userSchema.statics.validateLoginInput = function(data: unknown) {
  return LoginValidationSchema.parse(data);
};

// Crear y exportar el modelo
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;

// Funciones de utilidad para manejo de usuarios
export class UserService {
  /**
   * Crear un nuevo usuario con validación
   */
  static async createUser(userData: UserInput): Promise<IUser> {
    try {
      // Validar datos de entrada con Zod
      const validatedData = UserValidationSchema.parse(userData);
      
      // Verificar si el email ya existe
      const existingUser = await User.findOne({ email: validatedData.email });
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }
      
      // Crear nuevo usuario
      const user = new User(validatedData);
      await user.save();
      
      return user;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Datos inválidos: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }
  
  /**
   * Autenticar usuario con email y contraseña
   */
  static async authenticateUser(loginData: LoginInput): Promise<{ user: IUser; token: string }> {
    try {
      // Validar datos de entrada
      const validatedData = LoginValidationSchema.parse(loginData);
      
      // Buscar usuario por email
      const user = await User.findOne({ 
        email: validatedData.email,
        isActive: true 
      });
      
      if (!user) {
        throw new Error('Credenciales inválidas');
      }
      
      // Verificar contraseña
      const isPasswordValid = await user.comparePassword(validatedData.password);
      if (!isPasswordValid) {
        throw new Error('Credenciales inválidas');
      }
      
      // Actualizar último login
      user.lastLogin = new Date();
      await user.save();
      
      // Generar token
      const token = user.generateAuthToken();
      
      return { user, token };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Datos inválidos: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }
}