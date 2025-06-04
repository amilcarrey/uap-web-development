export const parseFormData = async (request: Request) => {
  const formData = await request.formData();
  const text = formData.get("task");
  const id = formData.get("task-id");
  const done = formData.get("done");
  const boardId = formData.get("boardId");
  return { text, id, done, boardId };
};

export const parseJson = async (
  request: Request
): Promise<{ text?: string; id?: string; done?: boolean; boardId?: string }> => {
  const { text, id, done, boardId } = await request.json();
  return {
    text: typeof text === "string" ? text : undefined,
    id: typeof id === "string" ? id : undefined,
    done: typeof done === "boolean" ? done : undefined,
    boardId: typeof boardId === "string" ? boardId : undefined,
  };
};
