import { motion } from "framer-motion";
import { Users, LogIn, LogOut, AlertTriangle } from "lucide-react";

interface StatsCardsProps {
  total: number;
  inside: number;
  outside: number;
  activeAlerts: number;
}

const cards = [
  { key: "total", label: "Total Students", icon: Users, color: "primary" },
  { key: "inside", label: "Inside", icon: LogIn, color: "primary" },
  { key: "outside", label: "Outside", icon: LogOut, color: "warning" },
  { key: "alerts", label: "Active Alerts", icon: AlertTriangle, color: "destructive" },
] as const;

export default function StatsCards({ total, inside, outside, activeAlerts }: StatsCardsProps) {
  const values = { total, inside, outside, alerts: activeAlerts };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card-hover p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-sm font-medium">{card.label}</span>
            <card.icon className={`w-5 h-5 text-${card.color}`} />
          </div>
          <p className="text-3xl font-bold text-foreground">{values[card.key]}</p>
        </motion.div>
      ))}
    </div>
  );
}
