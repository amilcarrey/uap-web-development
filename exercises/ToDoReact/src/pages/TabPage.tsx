import React from "react";
import { useParams } from "@tanstack/react-router";
import Header from "../components/Header";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import TabList from "../components/TabList";
import FilterButtons from "../components/FilterButtons";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import NotificationSystem from "../components/NotificationSystem";
import { useTabs } from "../hooks/useTabs";
import { useClientStore } from "../store/clientStore";

const TabPage: React.FC = () => {
  const { tabId } = useParams({ from: "/tab/$tabId" });
  const { setActiveTab } = useClientStore();
  const { data: tabsData, isLoading, error } = useTabs();

  //ACTIVE TAB BASED ON URL PARAMS
  React.useEffect(() => {
    if (tabId) {
      setActiveTab(tabId);
    }
  }, [tabId, setActiveTab]);

  // Priority: show error first (especially connection errors), then loading
  if (error) {
    return <ErrorMessage error={error.message} />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  //DEAR TAB, DO YOU EXIST? SURE YOU DOOOOOO. JK, THIS IS THE CHECK TO SEE IF THE TAB EXISTS.
  const tabExists = tabsData?.tabs.includes(tabId) || false;

  if (!tabExists && !isLoading) {
    return (
      <div className="min-h-screen bg-[url('/img/wood-pattern.png')] flex flex-col">
        <div className="flex-1 max-w-7xl mx-auto py-2 w-full px-4">
          <div className="bg-orange-950 border-4 border-amber-200 rounded-lg overflow-hidden">
            <Header />
            <div className="p-8 text-center">
              <TabList tabs={tabsData?.tabs || []} />
            </div>
            <Footer />
          </div>
        </div>
        <NotificationSystem />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/img/wood-pattern.png')] flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto py-2 w-full px-4">
        <div className="bg-orange-950 border-4 border-amber-200 rounded-lg overflow-hidden">
          <Header />
          <TaskForm />
          <TabList tabs={tabsData?.tabs || []} />
          <TaskList />
          <FilterButtons />
          <Footer />
        </div>
      </div>
      <NotificationSystem />
    </div>
  );
};

export default TabPage;
