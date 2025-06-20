import React from "react";
import { Link } from "@tanstack/react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[url('/img/wood-pattern.png')] flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto py-2 w-full px-4">
        <div className="bg-orange-950 border-4 border-amber-200 rounded-lg overflow-hidden">
          <Header />

          <div className="p-8 text-center">
            <h2 className="text-4xl font-bold text-amber-200 mb-4">404</h2>
            <h3 className="text-2xl font-semibold text-amber-200 mb-4">
              Page Not Found
            </h3>
            <p className="text-slate-100 mb-6">
              For fuck sake. You spilled the pint! There's no more guiness.
            </p>
            <div className="space-y-4">
              <Link
                to="/"
                className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Go Home mate!
              </Link>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
