// la idea es poder usar server actions para manejar las reseñas
// directamente desde el servidor 
import { Reseña } from '../tipos/libro';
import { getReseñasByLibro, agregarReseña, votarReseña } from '../../actions/resenas.actions';

interface ReseñaProps {
  libroId: string;
}

export default async function ReseñaComponente ({ libroId }: ReseñaProps) {
  const reseñas: Reseña[] = await getReseñasByLibro(libroId);


return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow-md" style={{ color: '#cd8c52' }}>
      <h3 className="text-xl font-semibold mb-4">Reseñas</h3>

      {/* Nombre de usuario */}
      <form action={async (formData) => {
          "use server";
          await agregarReseña(formData);
          // Redirige o refresca para mostrar la nueva reseña
      }} className="mb-4">
        <input
          type="hidden"
          name="idLibro"
          value={libroId}
        />

        <input
          type="text"
          name="usuario"
          placeholder="Tu nombre"
          className="w-full p-2 mb-4 rounded-md"
          style={{ border: '2px solid #b7d1a3', color: '#cd8c52' }}
          required
        />

        {/* Comentario */}
        <textarea
          name="comentario"
          placeholder="Escribe tu reseña aquí"
          className="w-full p-2 mb-4 rounded-md"
          style={{ border: '2px solid #b7d1a3', color: '#cd8c52' }}
          required
        />

        {/* Valoración + botón */}
        <div className="flex gap-2 mb-4">
          <select
            name="valoracion"
            className="p-2 rounded-md"
            style={{ border: '2px solid #b7d1a3', color: '#cd8c52' }}
          >
            {[1, 2, 3, 4, 5].map((valor) => (
              <option key={valor} value={valor}>
                {valor} Estrella{valor > 1 ? 's' : ''}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-2 rounded-md font-semibold shadow-md"
            style={{ backgroundColor: '#cd8c52', color: '#fff' }}
          >
            Agregar Reseña
          </button>
        </div>
      </form>

      {/* Listado de reseñas */}
      <div className="reseñas mt-6">
        {reseñas.length > 0 ? (
          reseñas.map((reseña) => (
            <div key={reseña.id} className="mb-4 p-4 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">{reseña.usuario}</span> -{' '}
                  {reseña.valoracion} Estrella
                  {reseña.valoracion > 1 ? 's' : ''}
                </div>

                <div className="flex gap-2">
                  <form action={votarReseña}>
                    <input type="hidden" name="id" value={reseña.id} />
                    <input type="hidden" name="tipo" value="like" />
                    <button type="submit" className="mr-2">
                      👍 {reseña.likes}
                    </button>
                  </form>

                  <form action={votarReseña}>
                    <input type="hidden" name="id" value={reseña.id} />
                    <input type="hidden" name="tipo" value="dislike" />
                    <button type="submit">
                      👎 {reseña.dislikes}
                    </button>
                  </form>
                </div>
              </div>
              <p>{reseña.comentario}</p>
            </div>
          ))
        ) : (
          <p>No hay reseñas aún.</p>
        )}
      </div>
    </div>
  );
};
