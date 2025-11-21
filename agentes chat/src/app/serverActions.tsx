export const URL = 'http://localhost:3000/api'

export async function enviarPrompt(message: string)
{
    const response = await fetch(`${URL}/messages`,
        {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({message})
        }
    )
    
    const data = await response.json();

    return data
}