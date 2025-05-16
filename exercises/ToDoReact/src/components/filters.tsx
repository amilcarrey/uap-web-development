function FiltersButtons() {
  return (
    <div className="filterContainer flex justify-center gap-[20px] m-[20px]">
      <a href="/?filtro=all" className="filterButtons bg-orange-400 text-white rounded-[6px] py-[10px] px-[15px] font-bold cursor-pointer hover:bg-[rgb(139,90,0)]">All</a>
      <a href="/?filtro=completadas" className="filterButtons bg-orange-400 text-white rounded-[6px] py-[10px] px-[15px] font-bold cursor-pointer hover:bg-[rgb(139,90,0)]">Completed</a>
      <a href="/?filtro=pendientes" className="filterButtons bg-orange-400 text-white rounded-[6px] py-[10px] px-[15px] font-bold cursor-pointer hover:bg-[rgb(139,90,0)]">Incompleted</a>
    </div>
  )
}
export default FiltersButtons;
  