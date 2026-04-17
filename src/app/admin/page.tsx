import { AdminShell } from "./components/AdminShell";
import { Dashboard } from "./components/Dashboard";

export default function AdminHome() {
  return (
    <AdminShell>
      <Dashboard />
    </AdminShell>
  );
}
