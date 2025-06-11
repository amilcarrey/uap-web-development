import React from "react";
import { useAuthStore } from "../store/authStore";
import { LogOut, User } from "lucide-react";
import GorgeousButton from "./GorgeousButton";

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    if (confirm("Are you sure you want to sign out?")) {
      logout();
    }
  };

  return (
    <header>
      <div className="max-w-4xl mx-auto py-2">
        <div className="bg-orange-950">
          <div className="text-center p-6 border-b-2 border-amber-200">
            {/* User Info Bar */}
            {user && (
              <div className="flex justify-between items-center mb-4 bg-amber-900/30 p-3 rounded border border-amber-600">
                <div className="flex items-center gap-2 text-amber-200">
                  <User className="w-4 h-4" />
                  <span className="text-sm">
                    Welcome back, <strong>{user.username}</strong>!
                  </span>
                </div>
                <GorgeousButton
                  onClick={handleLogout}
                  variant="red"
                  className="flex items-center gap-1 text-xs px-2 py-1"
                >
                  <LogOut className="w-3 h-3" />
                  Sign Out
                </GorgeousButton>
              </div>
            )}

            <h1 className="text-amber-200 text-3xl font-serif">
              The Old Stand
            </h1>
            <p className="text-slate-100 text-shadow italic mt-2">
              Wanna check which tasks you have to do in the pub? Welcome mate,
              cause this is the place. Cheers! 🍻
            </p>
            <div className="mt-4">
              <img
                src="/img/the-old-stand.jpg"
                alt="Irish Pub"
                className="w-full h-48 object-cover rounded border-2 border-amber-200"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
