import { useState } from 'react';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);

  const toggleMode = () => {
    setIsRegister(!isRegister);
  };

  return <LoginForm onToggleMode={toggleMode} isRegister={isRegister} />;
};
