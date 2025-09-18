export const parseFormData = async (request: Request) => {
  const formData = await request.formData();
  const text = formData.get("task");
  const id = formData.get("task-id");
  const done = formData.get("done");
  const activeBoardId = formData.get("boardId");
  return { text, id, done, activeBoardId };
};

export const parseJson = async (
  request: Request
): Promise<{ text?: string; id?: string; done?: boolean; activeBoardId?: string }> => {
  const { text, id, done, activeBoardId } = await request.json();
  return {
    text: typeof text === "string" ? text : undefined,
    id: typeof id === "string" ? id : undefined,
    done: typeof done === "boolean" ? done : undefined,
    activeBoardId: typeof activeBoardId === "string" ? activeBoardId : undefined,
  };
};
