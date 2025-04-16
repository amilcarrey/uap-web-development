export const parseFormData = async (request: Request) => {
    const formData = await request.formData();
    const text = formData.get("task");
    const id = formData.get("task-id");
    const done = formData.get("done");
    return { text, id, done };
  };
  
  export const parseJson = async (
    request: Request
  ): Promise<{ text?: string; id?: number; done?: boolean }> => {
    const { text, id, done } = await request.json();
    return {
      text: typeof text === "string" ? text : undefined,
      id: typeof id === "number" ? id : undefined,
      done: typeof done === "boolean" ? done : undefined,
    };
  };
  