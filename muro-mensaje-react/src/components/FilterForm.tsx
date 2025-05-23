type FilterFormProps =
    {
        tareasFilter: (filter: string) => void;
    }

export function FilterForm({tareasFilter}: FilterFormProps) {
    return (
        <section
            className="flex justify-center bg-[#faebd7] rounded-b-xl mx-auto w-3/5 p-3 gap-2"
        >
            <button
                type="submit"
                name="action"
                value="delete-checked"
                data-action-button="delete-button"
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
                onClick={() => {alert("aun no se implenta")}}
            >
                Borrar completadas
            </button>
            <button
                type="submit"
                name="action"
                value="list-check"
                data-action-button="check-button"
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
                onClick={() => {tareasFilter("completas")}}
            >Completadas
            </button>

            <button
                type="submit"
                name="action"
                value="list-uncheck"
                data-action-button="uncheck-button"
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
                onClick={() => {tareasFilter("incompletas")}}
            >Faltantes
            </button>

            <button
                type="submit"
                name="action"
                value="list-all"
                data-action-button="list-button"
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
                onClick={() => {tareasFilter("")}}
            >Todas
            </button>
        </section>
    )
}
