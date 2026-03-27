import { useAuthStore } from "../../store/authStore";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-6">
      <h2 className="font-semibold">Dashboard</h2>

      <div className="text-sm">
        {user?.email || "User"}
      </div>
    </div>
  );
}