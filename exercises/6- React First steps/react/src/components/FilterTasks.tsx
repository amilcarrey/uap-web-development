import type { FormEvent } from "react";

type FilterTasksProps = {
    filter: string;
    setFilter: (filter: string) => void;
};

export const FilterTasks = ({ filter, setFilter }: FilterTasksProps) => {
    const handleFilterChange = (event: FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const target = event.target as HTMLButtonElement;
        const selectedFilter = target.value;
        setFilter(selectedFilter);
    }
        

    return (
        <form 
        id="filter-form" 
        action="/api/todos" 
        method="GET" 
        className="flex justify-around items-center my-5"
        >
            <button 
            type="submit" 
            name="filter" 
            value="all" 
            className={`w-3/10 bg-[rgb(116,178,202)] text-white font-montserrat text-2xl py-2 px-5 border-0 rounded-full border-b-4 border-orange-300 hover:opacity-100 transition-all duration-500 ${filter === "all" ? 'opacity-100 shadow-md' : ' opacity-50'} shadow-black`}
            onClick={handleFilterChange}
            >
                Show all
            </button>
            <button 
            type="submit" 
            name="filter" 
            value="completed" 
            className={`w-3/10 bg-[rgb(116,178,202)] text-white font-montserrat text-2xl py-2 px-5 border-0 rounded-full border-b-4 border-orange-300  hover:opacity-100 transition-all duration-500 ${filter === "completed" ? 'opacity-100 shadow-md' : 'opacity-50'} shadow-black`}
            onClick={handleFilterChange}
            >
                Completed
            </button>
            <button 
            type="submit" 
            name="filter" 
            value="uncompleted" 
            className={`w-3/10 bg-[rgb(116,178,202)] text-white font-montserrat text-2xl py-2 px-5 border-0 rounded-full border-b-4 border-orange-300 hover:opacity-100 transition-all duration-500 ${filter === "uncompleted" ? 'opacity-100 shadow-md' : 'opacity-50'} shadow-black `}
            onClick={handleFilterChange}
            >
                Uncompleted
            </button>
        </form>
    )
};