import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, User, Eye } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 text-center"
      >
        {/* Logo */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center"
          >
            <Eye className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="text-4xl font-extrabold gradient-text">Hostel EYE</h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Smart hostel security &amp; monitoring platform powered by RFID and live surveillance
          </p>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate("/warden")}
            className="w-full glass-card-hover p-5 flex items-center gap-4 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-foreground font-semibold">Warden Dashboard</p>
              <p className="text-muted-foreground text-sm">Monitor students, manage alerts, view camera feeds</p>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate("/student")}
            className="w-full glass-card-hover p-5 flex items-center gap-4 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <p className="text-foreground font-semibold">Student Portal</p>
              <p className="text-muted-foreground text-sm">View status, timer, and request extensions</p>
            </div>
          </motion.button>
        </div>

        <p className="text-muted-foreground/50 text-xs">
          ESP32 RFID + CAM Integration Ready
        </p>
      </motion.div>
    </div>
  );
}
