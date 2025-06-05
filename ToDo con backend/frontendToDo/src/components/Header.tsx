import { Link } from "react-router";
import { FaCog } from "react-icons/fa";

export const Header = () => {
  return (
    <header className="bg-blend-hue text-white p-4 text-center  shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 ">
          <span className="text-blue-400">Atareado</span>.com
        </h1>

        <Link
          to="/settings"
          className="text-gray-800 hover:text-blue-500 transition-colors duration-300"
        >
          <FaCog className="inline-block mr-2" />
        </Link>
      </div>
    </header>
  );
};
