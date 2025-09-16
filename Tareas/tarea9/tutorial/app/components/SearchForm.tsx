import React from "react";
import SearchFormReset from "./SearchFormReset";

const SearchForm = ({query}: {query?: string}) => {
    
  return (
    <form action="/" className="search-form">
        <input name="query" 
        defaultValue={query} 
        className="search-input" 
        placeholder="Buscar libros..." 
        />
        <div className="flex gap-2">
            {query &&(<SearchFormReset />)}

            <button type="submit" className="search-btn text-white">
                S
            </button>
        </div>
    </form>
  );
}
export default SearchForm;