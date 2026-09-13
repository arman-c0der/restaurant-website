import { Toaster } from "react-hot-toast";
import AdminSidebar from "./components/adminsidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F8F7F3] text-black">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-8">{children}</main>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: "14px",
            color: "#000",
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)",
          },
        }}
      />
    </div>
  );
}