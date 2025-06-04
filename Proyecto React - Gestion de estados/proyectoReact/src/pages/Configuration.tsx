import { useParams } from "@tanstack/react-router"

export function Configuration() {
  const {} = useParams({ from: "/configuration" });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Configuration</h1>
      {/* Additional configuration settings can be displayed here */}
    </div>
  );
}