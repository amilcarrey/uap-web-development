const TopBar: React.FC = () => (
  <div className="w-full py-2 text-center bg-blanchedalmond box-border flex justify-around text-[20px]">
    <div className="flex gap-2">
      <button className="font-bold px-4 py-2 border-b-4 border-orange-500">Personal</button>
      <button className="font-bold px-4 py-2">Professional</button>
      <button className="font-bold px-4 py-2">+</button>
    </div>
  </div>
);

export default TopBar;
