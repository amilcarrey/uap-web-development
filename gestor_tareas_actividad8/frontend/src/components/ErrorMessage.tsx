interface Props {
  message?: string;
}

const ErrorMessage: React.FC<Props> = ({ message = 'Ocurrió un error' }) => {
  return (
    <div className="text-red-500 text-center p-4">
      ⚠️ {message}
    </div>
  );
};

export default ErrorMessage;
