export default function CategoryButton() {
  return (
    <div className="flex items-center justify-end p-1 bg-[antiquewhite] space-x-100 w-full h-[60px]">
      <button className="text-[30px] font-bold bg-[antiquewhite] px-3 py-1.5 cursor-pointer hover:text-[rgb(120,118,0)] hover:border-b-[3px] hover:border-[rgb(64,0,83)]">
        PERSONAL
      </button>
      <button className="text-[30px] font-bold bg-[antiquewhite] px-3 py-1.5 cursor-pointer hover:text-[rgb(120,118,0)] hover:border-b-[3px] hover:border-[rgb(64,0,83)]">
        PROFESIONAL
      </button>
      <button type="button" id="AddAreaButton" className="text-[20px] text-white bg-orange-400 px-2.5 py-1.5 rounded border-none cursor-pointer hover:bg-[rgb(139,90,0)]">
        +
      </button>
    </div>
  );
}
