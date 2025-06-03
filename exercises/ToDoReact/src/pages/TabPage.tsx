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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error.message} />;
  }

  //DEAR TAB, DO YOU EXIST? SURE YOU DOOOOOO. JK, THIS IS THE CHECK TO SEE IF THE TAB EXISTS.
  const tabExists = tabsData?.tabs.includes(tabId) || false;

  if (!tabExists && !isLoading) {
    return (
      <div className="min-h-screen bg-[url('/img/wood-pattern.png')] flex flex-col">
        <div className="flex-1 max-w-4xl mx-auto py-2 w-full">
          <div className="bg-orange-950 border-4 border-amber-200 rounded-lg overflow-hidden">
            <Header />
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-amber-200 mb-4">
                Tab Not Found
              </h2>
              <p className="text-slate-100 mb-4">
                The tab "{tabId}" doesn't exist.
              </p>
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
      <div className="flex-1 max-w-4xl mx-auto py-2 w-full">
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
