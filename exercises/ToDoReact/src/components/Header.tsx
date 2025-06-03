import React from "react";

const Header: React.FC = () => {
  return (
    <header>
      <div className="max-w-4xl mx-auto py-2">
        <div className="bg-orange-950">
          <div className="text-center p-6 border-b-2 border-amber-200">
            <h1 className="text-amber-200 text-3xl font-serif">The Old Stand</h1>
            <p className="text-slate-100 text-shadow italic mt-2"> Wanna check which tasks you have to do in the pub? Welcome mate, cause 
            this is the place. Cheers! 🍻</p>
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