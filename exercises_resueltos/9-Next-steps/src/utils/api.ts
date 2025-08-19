export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ocurrió un error inesperado';
};

export const fetcher = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Error fetching data');
  }
  
  return response.json();
};