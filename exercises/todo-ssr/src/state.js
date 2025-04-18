// Define example tasks that were previously in the global variable
const example_tasks = {
  today: [
    { id: 1, text: "Clean the bar counter", completed: false },
    { id: 2, text: "Restock the fridge", completed: false },
    { id: 3, text: "Sweep the floor", completed: false }
  ],
  kitchen: [
    { id: 4, text: "Wash the dishes", completed: false },
    { id: 5, text: "Clean the stove", completed: false },
    { id: 6, text: "Organize the pantry", completed: false }
  ],
  office: [
    { id: 7, text: "Check inventory", completed: false },
    { id: 8, text: "Prepare weekly report", completed: false },
    { id: 9, text: "Schedule team meeting", completed: false }
  ]
};

export const state = {
    tasks: {...example_tasks},
    tabs: ["today", "kitchen", "office"],
    nextId: 10,
    activeTab: "today",
    filter: 'all',
}
