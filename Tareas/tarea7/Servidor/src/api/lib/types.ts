export interface Task {
    id: string;
    text: string;
    completed: boolean;
    tabId: string;
  }

  export interface Tab {
    id: string;
    title: string;
  }
  
  export interface AppState {
    tasks: Task[];
    tabs: Tab[];
    currentTab: string;
    currentFilter: string;
  }