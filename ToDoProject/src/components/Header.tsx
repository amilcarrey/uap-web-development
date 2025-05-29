
const Header = () => (
  <>
    <h1 className="my-2 mx-auto text-center text-black text-7xl font-bold">ToDo</h1>
    <div className="categories flex justify-center space-x-6">
      <button type="button" className="boton-estilo">Personal</button>
      <button type="button" className="boton-estilo">+</button>
      <button type="button" className="boton-estilo">Profesional</button>
    </div>
  </>
);

export default Header;