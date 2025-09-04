type ClearCompletedProps = {
  clearCompleted: () => void;
};

export function ClearCompleted({ clearCompleted }: ClearCompletedProps) {
  return (
    <form method="POST" className="clear-completed-form" name="clear-completed-form" action="/api/clear-completed">
      <button type="submit" className="bg-[#d9534f] text-white py-2 px-5 rounded-[5px] mt-5 block mx-auto cursor-pointer hover:bg-[#c9302c]" name="clear-completed" onClick={(e) => {
        e.preventDefault();
        clearCompleted();
      }}>Clear Completed</button>
    </form>
  );
}