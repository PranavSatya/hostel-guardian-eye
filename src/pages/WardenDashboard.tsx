import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useHostelData } from "@/hooks/useHostelData";
import StatsCards from "@/components/hostel/StatsCards";
import StudentTable from "@/components/hostel/StudentTable";
import AlertsPanel from "@/components/hostel/AlertsPanel";
import AddStudentForm from "@/components/hostel/AddStudentForm";
import CameraFeed from "@/components/hostel/CameraFeed";
import { ArrowLeft, Shield } from "lucide-react";

export default function WardenDashboard() {
  const { students, alerts, stats, refresh } = useHostelData(3000);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-7 h-7 text-primary" />
              <div>
                <h1 className="text-2xl font-bold gradient-text">Hostel EYE</h1>
                <p className="text-muted-foreground text-sm">Warden Command Center</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="pulse-dot-green" />
            <span className="text-muted-foreground text-xs">System Active</span>
          </div>
        </div>

        {/* Stats */}
        <StatsCards {...stats} />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StudentTable students={students} onRefresh={refresh} />
            <CameraFeed />
          </div>
          <div className="space-y-6">
            <AlertsPanel alerts={alerts} onRefresh={refresh} />
            <AddStudentForm onRefresh={refresh} />
          </div>
        </div>
      </div>
    </div>
  );
}
