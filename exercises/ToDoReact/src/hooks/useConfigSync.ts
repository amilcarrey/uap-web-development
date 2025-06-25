import { useEffect } from "react";
import { useClientStore } from "../store/clientStore";
import { useConfigStore } from "../store/configStore";

/**
 * Hook to sync client store with config store values
 * This should be used in the main App component
 */
export const useConfigSync = () => {
  const { config } = useConfigStore();
  const { filter, setFilter, activeTab } = useClientStore();

  // Set default filter based on hideCompletedTasksByDefault setting
  // Only apply when switching to a new tab or on initial load
  useEffect(() => {
    if (config.hideCompletedTasksByDefault && filter === "all") {
      setFilter("active");
    }
  }, [activeTab, config.hideCompletedTasksByDefault]);

  // Return current config for components that need it
  return config;
};
