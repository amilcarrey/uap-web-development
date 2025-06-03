import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="w-full h-screen gap-1 pt-40 pb-40 relative flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('/img/wood-pattern.png')] opacity-75 pointer-events-none z-0" />
      <div className="flex flex-col items-center animate-[bounce_1s_ease-in-out_infinite_0.1s] z-10">
        <div className="w-1 h-6 bg-green-500"></div>
        <div className="w-3 h-12 bg-green-500 rounded-sm"></div>
        <div className="w-1 h-6 bg-green-500"></div>
      </div>
      <div className="flex flex-col items-center animate-[bounce_1s_ease-in-out_infinite_0.2s] z-10">
        <div className="w-1 h-6 bg-red-500"></div>
        <div className="w-3 h-12 bg-red-500 rounded-sm"></div>
        <div className="w-1 h-6 bg-red-500"></div>
      </div>
      <div className="flex flex-col items-center animate-[bounce_1s_ease-in-out_infinite_0.1s] z-10">
        <div className="w-1 h-6 bg-green-500"></div>
        <div className="w-3 h-12 bg-green-500 rounded-sm"></div>
        <div className="w-1 h-6 bg-green-500"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
