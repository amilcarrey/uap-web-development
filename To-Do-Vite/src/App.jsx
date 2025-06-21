import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ToastContainer from './components/ToastContainer';
import router from './routes';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
