import React from "react";
import { Link } from "@tanstack/react-router";
import { useConfigStore } from "../store/configStore";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NotificationSystem from "../components/NotificationSystem";
import { ChevronsLeft } from "lucide-react";
import GorgeousButton from "../components/GorgeousButton";

const SettingsPage: React.FC = () => {
  const { config, setConfig, resetConfig } = useConfigStore();

  const handleRefetchIntervalChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setConfig({ taskRefetchInterval: value });
    }
  };

  const handleUppercaseToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ uppercaseDescriptions: e.target.checked });
  };

  const handleReset = () => {
    resetConfig();
  };

  return (
    <div className="min-h-screen bg-[url('/img/wood-pattern.png')] flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto py-2 w-full px-4">
        <div className="bg-orange-950 border-4 border-amber-200 rounded-lg overflow-hidden">
          <Header />

          {/* Navigation */}
          <div className="border-b-2 border-amber-700 p-4">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-amber-200 hover:text-amber-100 underline"
              >
                <ChevronsLeft className="inline-block mr-1" />
              </Link>
              <h2 className="text-2xl font-bold text-amber-200">Settings</h2>
            </div>
          </div>

          {/* Settings Content */}
          <div className="p-6 space-y-6">
            {/* Task Refetch Interval */}
            <div className="bg-amber-900 p-4 rounded-lg">
              <label className="block text-lg font-semibold text-orange-200 mb-2">
                Task Refetch Interval
              </label>
              <p className="text-amber-200 text-sm mb-3">
                How often should tasks be automatically refreshed? (in seconds)
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={config.taskRefetchInterval}
                  onChange={handleRefetchIntervalChange}
                  className="w-24 px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-amber-300">seconds</span>
              </div>
              <p className="text-amber-200 text-xs mt-2">
                Current: Tasks refresh every {config.taskRefetchInterval}{" "}
                seconds
              </p>
            </div>

            {/*UPPERCASE TASKS FEATURE*/}
            <div className="bg-amber-900 p-4 rounded-lg">
              <label className="block text-lg font-semibold text-orange-200 mb-2">
                Task Description Format
              </label>
              <p className="text-orange-300 text-sm mb-3">
                Display task descriptions in uppercase letters
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="uppercase-toggle"
                  //TOGGLING THAT CALLS THE CONFIG STORE TO SWITCH BETWEEN UPPERCASE AND NORMAL CASE
                  checked={config.uppercaseDescriptions}
                  onChange={handleUppercaseToggle}
                  className="w-5 h-5 text-orange-600 focus:ring-orange-500 border-orange-300 rounded"
                />
                <label
                  htmlFor="uppercase-toggle"
                  className="text-amber-300 cursor-pointer"
                >
                  Show descriptions in UPPERCASE
                </label>
              </div>
              <p className="text-amber-200 text-xs mt-2">
                {config.uppercaseDescriptions
                  ? "Descriptions will appear in UPPERCASE"
                  : "Descriptions will appear in normal case"}
              </p>
            </div>

            {/*RESTORE INTO FACTORY weeeeeeeee*/}
            <div className="bg-amber-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-amber-200 mb-2">
                Reset Settings
              </h3>
              <p className="text-amber-300 text-sm mb-3">
                Reset all settings to their default values
              </p>
              <GorgeousButton onClick={handleReset} variant="red">
                Reset to Defaults
              </GorgeousButton>
            </div>
          </div>

          <Footer />
        </div>
      </div>
      <NotificationSystem />
    </div>
  );
};

export default SettingsPage;
