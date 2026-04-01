import { type Student } from "@/services/hostelStore";
import { scanRFID } from "@/services/hostelStore";
import { toast } from "sonner";

interface StudentTableProps {
  students: Student[];
  onRefresh: () => void;
}

function formatTime(ms: number | null): string {
  if (!ms) return "—";
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  if (mins > 0) return `${mins}m ${secs}s ago`;
  return `${secs}s ago`;
}

export default function StudentTable({ students, onRefresh }: StudentTableProps) {
  const handleSimulateScan = (uid: string) => {
    const result = scanRFID(uid);
    toast(result.message);
    onRefresh();
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Student Registry</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 text-muted-foreground text-sm font-medium">Name</th>
              <th className="text-left p-3 text-muted-foreground text-sm font-medium">RFID UID</th>
              <th className="text-left p-3 text-muted-foreground text-sm font-medium">Status</th>
              <th className="text-left p-3 text-muted-foreground text-sm font-medium">Last Scan</th>
              <th className="text-left p-3 text-muted-foreground text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.uid} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="p-3 text-foreground font-medium">{s.name}</td>
                <td className="p-3 font-mono text-muted-foreground text-sm">{s.uid}</td>
                <td className="p-3">
                  <span className={s.status === "IN" ? "status-badge-in" : "status-badge-out"}>
                    {s.status === "IN" ? "● INSIDE" : "● OUTSIDE"}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground text-sm">{formatTime(s.lastScanTime)}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleSimulateScan(s.uid)}
                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                  >
                    Simulate Scan
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">No students registered</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
