import React, { useRef } from "react";
import { useClientStore } from "../store/clientStore";
import { useClearCompleted } from "../hooks/useTasks";
import GorgeousButton from "./GorgeousButton";

const FilterButtons: React.FC = () => {
  const { setFilter, activeTab } = useClientStore();
  const clearCompletedMutation = useClearCompleted();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  function handleConfirm() {
    clearCompletedMutation.mutate(activeTab);
    dialogRef.current?.close();
  }

  function handleCancel(): void {
    dialogRef.current?.close();
  }

  //CLOSE DIALOG CLICKING OUTSIDE
  function handleDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === e.currentTarget) {
      dialogRef.current?.close();
    }
  }

  //CLOSE DIALOG WITH ESCAPE
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "Escape") {
      dialogRef.current?.close();
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 p-4">
      <GorgeousButton onClick={() => setFilter("all")}>All</GorgeousButton>

      <GorgeousButton onClick={() => setFilter("active")}>
        Pending
      </GorgeousButton>

      <GorgeousButton onClick={() => setFilter("completed")}>
        Completed
      </GorgeousButton>

      <GorgeousButton
        onClick={openDialog}
        disabled={clearCompletedMutation.isPending}
        variant="red"
      >
        {clearCompletedMutation.isPending ? "Cleaning..." : "Clear Completed"}
      </GorgeousButton>

      {/*DIALOG POP TO CLEAR THE COMPLETED TASKS*/}
      <dialog
        ref={dialogRef}
        onClick={handleDialogClick}
        onKeyDown={handleKeyDown}
        className="irish-pub-dialog backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="bg-orange-950 border-4 border-amber-300 rounded-lg p-6 max-w-md shadow-2xl">
          <div className="text-center mb-6">
            <p className="text-amber-100 mb-3">
              You sure you want to clear all completed tasks?
            </p>
            <div className="bg-amber-900/50 p-4 rounded border border-amber-600">
              <div className="flex items-center justify-center gap-2 mb-2">
                <p className="text-amber-200 font-bold">Tab: "{activeTab}"</p>
              </div>
              <p className="text-amber-300 text-sm">
                The completed tasks will be removed from the list.
              </p>
            </div>
            <p className="text-amber-300 text-sm mt-3">
              This action cannot be undone. Are you sure?
            </p>
          </div>

          {/*BUTTONS*/}
          <div className="flex gap-3 justify-center">
            <GorgeousButton onClick={handleCancel}>Cancel</GorgeousButton>
            <GorgeousButton
              onClick={handleConfirm}
              disabled={clearCompletedMutation.isPending}
              variant="red"
            >
              {clearCompletedMutation.isPending ? "Cleaning..." : "Clear"}
            </GorgeousButton>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default FilterButtons;
