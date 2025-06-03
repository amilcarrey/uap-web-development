import React from "react";

interface ErrorMessageProps {
  error: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-50">
      <div className="text-center text-red-600">
        <h2 className="text-2xl font-bold mb-2">
          What you at? You have an Error... {">:("}
        </h2>
        <p>{error}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
