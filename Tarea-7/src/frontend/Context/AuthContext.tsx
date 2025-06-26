import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useEffect,
} from "react";


interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGOUT" }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };


const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
};


const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | undefined>(undefined);


function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload, isLoading: false, error: null };
    case "LOGOUT":
      return { ...state, user: null, isLoading: false, error: null };
    case "AUTH_ERROR":
      return { ...state, user: null, isLoading: false, error: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkAuth = async () => {
      dispatch({ type: "SET_LOADING", payload: true });

      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("No autenticado");
        }

        const data: { user: User } = await res.json();

        if (!data?.user) {
          throw new Error("Respuesta sin usuario");
        }

        dispatch({ type: "LOGIN_SUCCESS", payload: data.user });
      } catch (error: any) {
        dispatch({
          type: "AUTH_ERROR",
          payload: error?.message || "Error al verificar autenticación",
        });
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
