import { BoardsList } from "./BoardList"
import { useLocation } from "react-router-dom";

export function Header() {
    const location = useLocation();
    const isSettingsPage = location.pathname === '/settings';
    const isBoardsPage = location.pathname === '/boards';
    console.log("Current path:", location.pathname);

    return (
        <header>
            <h1 className="font-montserrat font-normal text-5xl bg-[rgba(241,236,230,255)] m-0 text-center py-3">
                <span className="text-gray-500">TO</span> 
                <span className="text-orange-500 ">DO</span>
            </h1>
            {!isSettingsPage && !isBoardsPage && <BoardsList />}
        </header>
    )
};