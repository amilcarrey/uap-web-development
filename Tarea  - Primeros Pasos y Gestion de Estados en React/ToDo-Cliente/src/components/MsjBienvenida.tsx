import { useGoToFirstTab } from "../hooks/useGoToFirstTab";

export function MsjBienvenida() {
  const goToFirstTab = useGoToFirstTab();

  return (
    <div className="text-center py-10 text-xl text-gray-600 ">
      Bienvido al gestor de tareas. Aquí podrás organizar tus tareas de manera eficiente y sencilla.
      <br />
      <button
        className="mt-6 px-4 py-2 bg-burlywood rounded text-white bg-[#a57a5a] hover:cursor-pointer"
        onClick={goToFirstTab}
      >
        Iniciar
      </button>
    </div>
  );
}