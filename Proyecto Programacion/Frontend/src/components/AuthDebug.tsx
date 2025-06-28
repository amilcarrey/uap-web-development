import { useAuthStore } from "../stores/authStore";
import { getUserFromToken, getUserFromJWTString } from "../utils/auth";

export function AuthDebug() {
  const user = useAuthStore(s => s.user);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const tokenData = getUserFromToken();
  const storedToken = localStorage.getItem('authToken');
  const localStorageTokenData = storedToken ? getUserFromJWTString(storedToken) : null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: 10, 
      right: 10, 
      background: 'rgba(0,0,0,0.9)', 
      color: 'white', 
      padding: '10px', 
      fontSize: '11px',
      borderRadius: '5px',
      zIndex: 9999,
      maxWidth: '350px',
      maxHeight: '400px',
      overflow: 'auto'
    }}>
      <div><strong>🔍 Auth Debug:</strong></div>
      <div>✅ isAuthenticated: {isAuthenticated ? 'true' : 'false'}</div>
      <div>👤 user: {user ? `${user.alias} (ID: ${user.id})` : 'null'}</div>
      <div>🍪 cookies: {document.cookie || 'vacías'}</div>
      <div>🍪 tokenData: {tokenData ? `${tokenData.alias} (ID: ${tokenData.id})` : 'null'}</div>
      <div>💾 localStorage token: {storedToken ? `${storedToken.substring(0, 20)}...` : 'null'}</div>
      <div>💾 localStorage data: {localStorageTokenData ? `${localStorageTokenData.alias} (ID: ${localStorageTokenData.id})` : 'null'}</div>
    </div>
  );
}
