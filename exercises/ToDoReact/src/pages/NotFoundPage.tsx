import React from "react";
import { Link } from "@tanstack/react-router";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[url('./img/guiness-404.jpg')] bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center">
      <div className="text-center p-8">
        <p className="text-slate-100 mb-6 text-lg text-shadow-lg drop-shadow-lg shadow-black">
          For fuck sake. You spilled the pint! There's no more guiness.
        </p>
        <Link
          to="/"
          className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Go Home mate!
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
