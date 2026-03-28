import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ children }: any) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}