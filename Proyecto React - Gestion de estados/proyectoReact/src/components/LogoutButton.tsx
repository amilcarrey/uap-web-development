import { useAuth } from "../hooks/useAuth";

export function LogoutButton() {
  const { logout, isPending } = useAuth();

  return (
    <button
      onClick={() => logout()}
      className="fixed top-4 left-4 p-2 bg-red-500 text-white rounded-md shadow-lg hover:bgpred-600 transition cursor-pointer"
      disabled={isPending}
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}