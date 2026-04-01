import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getStudent, requestExtension, scanRFID, type Student } from "@/services/hostelStore";
import { toast } from "sonner";
import { User, Clock, ShieldAlert, ArrowLeft, Radio } from "lucide-react";

export default function StudentDashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const uid = searchParams.get("uid") || "";
  const [student, setStudent] = useState<Student | null>(null);
  const [timer, setTimer] = useState("");

  useEffect(() => {
    if (!uid) return;
    const interval = setInterval(() => {
      const s = getStudent(uid);
      setStudent(s);
      if (s?.status === "OUT" && s.exitTime) {
        const diff = Date.now() - s.exitTime;
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimer(`${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`);
      } else {
        setTimer("00:00");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [uid]);

  const handleRequest = () => {
    const result = requestExtension(uid);
    toast(result.message);
  };

  const handleSimulateScan = () => {
    const result = scanRFID(uid);
    toast(result.message);
  };

  if (!uid) {
    return <StudentUidEntry />;
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-sm">
          <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-3" />
          <p className="text-foreground font-semibold">Student not found</p>
          <p className="text-muted-foreground text-sm mt-1">UID: {uid}</p>
          <button onClick={() => navigate("/student")} className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isOvertime = student.status === "OUT" && student.hasReturnedEvening && student.exitTime && (Date.now() - student.exitTime > 600000);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-secondary/50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Hostel EYE</h1>
            <p className="text-muted-foreground text-sm">Student Portal</p>
          </div>
        </div>

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-hover p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{student.name}</h2>
              <p className="text-muted-foreground text-sm font-mono">UID: {student.uid}</p>
            </div>
          </div>
        </motion.div>

        {/* Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-hover p-6">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Current Status</span>
            <span className={student.status === "IN" ? "status-badge-in" : "status-badge-out"}>
              {student.status === "IN" ? "● INSIDE" : "● OUTSIDE"}
            </span>
          </div>
        </motion.div>

        {/* Timer */}
        {student.status === "OUT" && student.hasReturnedEvening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`glass-card p-6 border ${isOvertime ? "border-destructive/50" : "border-border"}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock className={`w-5 h-5 ${isOvertime ? "text-destructive" : "text-warning"}`} />
              <span className="text-muted-foreground text-sm">Time Outside</span>
            </div>
            <p className={`text-4xl font-mono font-bold ${isOvertime ? "text-destructive" : "text-foreground"}`}>
              {timer}
            </p>
            {isOvertime && !student.extensionRequested && !student.extensionApproved && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-destructive text-sm font-medium">⚠ Time exceeded! Request an extension.</p>
              </div>
            )}
            {student.extensionRequested && (
              <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-warning text-sm font-medium">Extension requested. Awaiting approval...</p>
              </div>
            )}
            {student.extensionApproved && (
              <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-primary text-sm font-medium">✓ Extension approved! Timer reset.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {student.status === "OUT" && student.alertTriggered && !student.extensionRequested && !student.extensionApproved && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleRequest}
              className="w-full py-3 rounded-lg bg-warning text-warning-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Request Extension
            </motion.button>
          )}

          <button
            onClick={handleSimulateScan}
            className="w-full py-3 rounded-lg glass-card border border-primary/30 text-primary font-semibold text-sm hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
          >
            <Radio className="w-4 h-4" />
            Simulate RFID Scan
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentUidEntry() {
  const [uid, setUid] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uid.trim()) {
      navigate(`/student?uid=${uid.trim().toUpperCase()}`);
    }
  };

  // Quick access UIDs
  const presetStudents = [
    { uid: "A1B2C3D4", name: "Rahul Sharma" },
    { uid: "E5F6G7H8", name: "Priya Patel" },
    { uid: "I9J0K1L2", name: "Amit Kumar" },
    { uid: "M3N4O5P6", name: "Sneha Reddy" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold gradient-text">Student Portal</h1>
          <p className="text-muted-foreground text-sm mt-1">Enter your RFID UID to access your dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Enter RFID UID"
            value={uid}
            onChange={e => setUid(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground font-mono text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button type="submit" className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
            Access Dashboard
          </button>
        </form>
        <div className="border-t border-border pt-4">
          <p className="text-muted-foreground text-xs mb-2 uppercase tracking-wider">Quick Access</p>
          <div className="grid grid-cols-2 gap-2">
            {presetStudents.map(s => (
              <button
                key={s.uid}
                onClick={() => navigate(`/student?uid=${s.uid}`)}
                className="p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors text-left"
              >
                <p className="text-foreground text-sm font-medium">{s.name}</p>
                <p className="text-muted-foreground text-xs font-mono">{s.uid}</p>
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => navigate("/")} className="w-full text-muted-foreground text-sm hover:text-foreground transition-colors">
          ← Back to Home
        </button>
      </motion.div>
    </div>
  );
}
