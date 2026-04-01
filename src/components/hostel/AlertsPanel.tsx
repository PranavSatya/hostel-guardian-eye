import { type Alert } from "@/services/hostelStore";
import { approveExtension } from "@/services/hostelStore";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface AlertsPanelProps {
  alerts: Alert[];
  onRefresh: () => void;
}

export default function AlertsPanel({ alerts, onRefresh }: AlertsPanelProps) {
  const activeAlerts = alerts.filter(a => !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved).slice(-5);

  const handleApprove = (uid: string) => {
    const result = approveExtension(uid);
    toast.success(result.message);
    onRefresh();
  };

  return (
    <div className="glass-card">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-destructive" />
        <h3 className="text-lg font-semibold text-foreground">Alerts & Requests</h3>
        {activeAlerts.length > 0 && (
          <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold bg-destructive/20 text-destructive">
            {activeAlerts.length}
          </span>
        )}
      </div>
      <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
        <AnimatePresence>
          {activeAlerts.map(alert => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-3 rounded-lg border border-destructive/30 bg-destructive/5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{alert.studentName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => handleApprove(alert.uid)}
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20 whitespace-nowrap"
                >
                  Approve Extension
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {activeAlerts.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-4">No active alerts</p>
        )}

        {resolvedAlerts.length > 0 && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Resolved</p>
            {resolvedAlerts.map(alert => (
              <div key={alert.id} className="flex items-center gap-2 py-1.5 text-muted-foreground/60">
                <CheckCircle className="w-3.5 h-3.5" />
                <span className="text-xs">{alert.studentName} — {alert.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
