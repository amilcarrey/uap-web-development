// Rate limiting con persistencia para backend
// Para desarrollo: usa archivo JSON
// Para producción: reemplazar con Redis/Vercel KV

import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitStore {
  [key: string]: RateLimitEntry;
}

class PersistentRateLimiter {
  private limits = new Map<string, RateLimitEntry>();
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly storePath: string;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor(maxRequests: number = 60, windowMs: number = 60 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    // Guardar en directorio temporal o .next para desarrollo
    this.storePath = join(process.cwd(), '.next', 'rate-limit-store.json');
    
    // Cargar datos existentes al iniciar
    this.loadFromDisk();
  }

  private async loadFromDisk() {
    try {
      // Crear directorio .next si no existe
      const dir = join(process.cwd(), '.next');
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }

      if (existsSync(this.storePath)) {
        const data = await readFile(this.storePath, 'utf-8');
        const store: RateLimitStore = JSON.parse(data);
        
        const now = Date.now();
        // Cargar solo entradas no expiradas
        for (const [key, entry] of Object.entries(store)) {
          if (now < entry.resetTime) {
            this.limits.set(key, entry);
          }
        }
        console.log('✅ Rate limit data cargada desde disco');
      }
    } catch (error) {
      console.error('⚠️ Error al cargar rate limit data:', error);
    }
  }

  private async saveToDisk() {
    // Debounce: guardar después de 2 segundos de inactividad
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    this.saveTimeout = setTimeout(async () => {
      try {
        const store: RateLimitStore = {};
        const now = Date.now();
        
        // Guardar solo entradas no expiradas
        for (const [key, entry] of this.limits.entries()) {
          if (now < entry.resetTime) {
            store[key] = entry;
          }
        }

        await writeFile(this.storePath, JSON.stringify(store, null, 2), 'utf-8');
      } catch (error) {
        console.error('⚠️ Error al guardar rate limit data:', error);
      }
    }, 2000);
  }

  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    // Si no existe o ya expiró, crear nueva entrada
    if (!entry || now > entry.resetTime) {
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + this.windowMs,
      };
      this.limits.set(identifier, newEntry);
      this.saveToDisk(); // Guardar cambios
      
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: newEntry.resetTime,
      };
    }

    // Si alcanzó el límite
    if (entry.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Incrementar contador
    entry.count++;
    this.saveToDisk(); // Guardar cambios
    
    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  // Limpiar entradas expiradas
  cleanup() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Rate limiter: ${cleaned} entradas expiradas limpiadas`);
      this.saveToDisk();
    }
  }

  // Método para forzar guardado (útil al cerrar servidor)
  async forceSync() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    const store: RateLimitStore = {};
    const now = Date.now();
    
    for (const [key, entry] of this.limits.entries()) {
      if (now < entry.resetTime) {
        store[key] = entry;
      }
    }

    try {
      await writeFile(this.storePath, JSON.stringify(store, null, 2), 'utf-8');
      console.log('💾 Rate limit data guardada');
    } catch (error) {
      console.error('⚠️ Error al guardar rate limit data:', error);
    }
  }
}

// Instancia global con persistencia
export const rateLimiterPersistent = new PersistentRateLimiter(60, 60 * 60 * 1000);

// Cleanup cada 10 minutos
if (typeof setInterval !== 'undefined') {
  setInterval(() => rateLimiterPersistent.cleanup(), 10 * 60 * 1000);
}

// Guardar al cerrar proceso (solo en Node.js)
if (typeof process !== 'undefined' && process.on) {
  process.on('SIGINT', async () => {
    await rateLimiterPersistent.forceSync();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    await rateLimiterPersistent.forceSync();
    process.exit(0);
  });
}
