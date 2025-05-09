export interface Task {
    id: string;
    text: string;
    completed: boolean;
    tabId: string;
  }
  
  export interface AppState {
    tasks: Task[];
    currentTab: string;
    currentFilter: string;
  }