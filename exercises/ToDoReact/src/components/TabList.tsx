import React, { useState } from "react";
import { Link, useParams, useNavigate } from "@tanstack/react-router";
import { useClientStore } from "../store/clientStore";
import { useAddTab, useDeleteTab } from "../hooks/useTabs";
import { Bolt } from "lucide-react";

interface TabListProps {
  tabs: string[];
}

const TabList: React.FC<TabListProps> = ({ tabs }) => {
  const { tabId } = useParams({ from: "/tab/$tabId" }) || {
    tabId: "today",
  };
  const navigate = useNavigate();
  const { isAddingTab, setIsAddingTab } = useClientStore();
  const [newTabName, setNewTabName] = useState("");
  const [validationError, setValidationError] = useState<string>("");
  const addTabMutation = useAddTab();
  const deleteTabMutation = useDeleteTab();

  const handleAddTab = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(""); // Clear previous errors

    if (newTabName.trim()) {
      const trimmedName = newTabName.trim();

      // Validate minimum length
      if (trimmedName.length < 2) {
        setValidationError("Board name must be at least 2 characters long");
        return;
      }

      // Validate maximum length
      if (trimmedName.length > 50) {
        setValidationError("Board name must be less than 50 characters");
        return;
      }

      // Check if a tab with this name already exists (case-insensitive)
      const existingTab = tabs.find(
        (tab) => tab.toLowerCase() === trimmedName.toLowerCase()
      );

      if (existingTab) {
        setValidationError(
          `A board with the name "${trimmedName}" already exists. Please choose a different name.`
        );
        return;
      }

      // Use the original name, not transformed
      addTabMutation.mutate(trimmedName, {
        onSuccess: () => {
          setNewTabName("");
          setIsAddingTab(false);
          setValidationError("");
        },
        onError: (error: Error) => {
          // Handle backend validation errors
          if (error.message.includes("already exists")) {
            setValidationError(
              `A board with the name "${trimmedName}" already exists. Please choose a different name.`
            );
          } else {
            setValidationError(error.message || "Failed to create board");
          }
        },
      });
    } else {
      setValidationError("Please enter a board name");
    }
  };

  const handleCancelAdd = () => {
    setNewTabName("");
    setIsAddingTab(false);
    setValidationError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTabName(e.target.value);
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError("");
    }
  };

  const handleDeleteTab = (tabName: string) => {
    if (tabs.length <= 1) {
      return;
    }
    if (
      confirm(
        `Are you sure you want to delete the "${tabName}" tab? This action cannot be undone.`
      )
    ) {
      // If we're deleting the currently active tab, navigate to another tab
      const isCurrentTab = tabId === tabName;
      const remainingTabs = tabs.filter((tab) => tab !== tabName);

      deleteTabMutation.mutate(tabName, {
        onSuccess: () => {
          console.log("✅ Tab deleted successfully, checking navigation...");

          // If we deleted the current tab, navigate to the first remaining tab
          if (isCurrentTab && remainingTabs.length > 0) {
            console.log(`🔄 Navigating to: ${remainingTabs[0]}`);
            navigate({
              to: "/tab/$tabId",
              params: { tabId: remainingTabs[0] },
            });
          }
        },
      });
    }
  };

  return (
    <div className="border-t-2 border-b-2 border-amber-700 p-2">
      <div className="flex overflow-x-auto items-center gap-2">
        {/*MAPPING OF ALL THE EXISTING TABS*/}
        <ul className="flex space-x-1">
          {tabs.map((tab) => (
            <li key={tab} className="flex items-center">
              <Link
                to="/tab/$tabId"
                params={{ tabId: tab }}
                className={`px-3 py-1 rounded text-sm font-bold border whitespace-nowrap flex items-center gap-2 ${
                  tabId === tab
                    ? "bg-amber-700 text-slate-100 border-amber-500"
                    : "bg-amber-900 text-slate-100 border-amber-600 hover:bg-amber-800"
                }`}
              >
                {tab}
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteTab(tab);
                    }}
                    className="ml-1 text-red-300 hover:text-red-100 text-xs"
                    title={`Delete ${tab} tab`}
                  >
                    ✕
                  </button>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {isAddingTab ? (
          <form
            onSubmit={handleAddTab}
            className="relative flex items-center gap-2"
          >
            <input
              type="text"
              value={newTabName}
              onChange={handleInputChange}
              placeholder="Tab name..."
              className="bg-amber-100 px-2 py-1 text-sm rounded focus:outline-none focus:ring focus:ring-amber-500"
              autoFocus
              disabled={addTabMutation.isPending}
            />
            <button
              type="submit"
              disabled={addTabMutation.isPending || !newTabName.trim()}
              className="bg-green-700 hover:bg-green-600 text-white px-2 py-1 text-sm rounded"
            >
              {addTabMutation.isPending ? "..." : "✓"}
            </button>
            <button
              type="button"
              onClick={handleCancelAdd}
              className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 text-sm rounded"
            >
              ✕
            </button>
            {/* Validation Error Message */}
            {validationError && (
              <div className="absolute top-full left-0 mt-1 bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded text-xs z-10 whitespace-nowrap">
                {validationError}
              </div>
            )}
          </form>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsAddingTab(true);
            }}
            className="hover:bg-amber-800 text-slate-100 font-bold px-3 py-1 rounded text-sm border border-amber-200 whitespace-nowrap"
          >
            +
          </button>
        )}

        {/*ROUTE TO THE SETTINGS */}
        <Link
          to="/settings"
          className="ml-auto bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-sm font-medium whitespace-nowrap"
        >
          <Bolt />
        </Link>
      </div>
    </div>
  );
};

export default TabList;
