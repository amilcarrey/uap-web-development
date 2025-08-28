// Crea/recupera un userId anónimo en localStorage para autoría y votos
export function useUserId(){
const key = 'bookverse:userId'
let id = localStorage.getItem(key)
if(!id){ id = crypto.randomUUID(); localStorage.setItem(key, id) }
return id
}