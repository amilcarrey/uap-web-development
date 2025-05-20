export function Header() {
    return (
        <header>
        <h1 className="font-montserrat font-normal text-5xl bg-[rgba(241,236,230,255)] m-0 text-center py-3">
        <span className="text-gray-500">TO</span><span className="text-orange-500">DO</span>
    </h1>
    <div className="flex items-center bg-[rgba(243,243,243,255)]">
        <h3 className="flex-grow text-center font-montserrat font-bold text-2xl tracking-wider py-2 px-2 m-0 opacity-35 hover:opacity-100 cursor-pointer transition-opacity duration-500" id="personal">Personal</h3>
        <h3 className="flex-grow text-center font-montserrat font-bold text-2xl tracking-wider py-2 px-2 m-0 opacity-35 hover:opacity-100 cursor-pointer transition-opacity duration-500">Professional</h3>
        <button id="add-category" className="flex-shrink-0 bg-[rgba(173,131,131,255)] text-[rgba(243,243,243,255)] font-inter text-4xl border-0 py-1 px-2 hover:bg-[rgb(202,68,68)] hover:text-white transition-colors duration-500">+</button>
    </div>
</header>
    )
};