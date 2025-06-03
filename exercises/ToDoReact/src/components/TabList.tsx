import React, { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
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
  const { isAddingTab, setIsAddingTab } = useClientStore();
  const [newTabName, setNewTabName] = useState("");
  const addTabMutation = useAddTab();
  const deleteTabMutation = useDeleteTab();

  const handleAddTab = (e: React.FormEvent) => {
    e.preventDefault();

    if (newTabName.trim()) {
      const tabId = newTabName.trim().toLowerCase().replace(/\s+/g, "-");
      addTabMutation.mutate(tabId, {
        onSuccess: () => {
          setNewTabName("");
          setIsAddingTab(false);
        },
      });
    }
  };

  const handleCancelAdd = () => {
    setNewTabName("");
    setIsAddingTab(false);
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
      deleteTabMutation.mutate(tabName);
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
          <form onSubmit={handleAddTab} className="flex items-center gap-2">
            <input
              type="text"
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
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
