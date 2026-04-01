import { useEffect, useRef, useState, useCallback } from "react";
import {
  getAllStudents,
  getAlerts,
  getStats,
  runTimerCheck,
  type Student,
  type Alert,
} from "@/services/hostelStore";

export function useHostelData(intervalMs = 3000) {
  const [students, setStudents] = useState<Student[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState({ total: 0, inside: 0, outside: 0, activeAlerts: 0 });
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const refresh = useCallback(() => {
    runTimerCheck();
    setStudents(getAllStudents());
    setAlerts(getAlerts());
    setStats(getStats());
  }, []);

  useEffect(() => {
    refresh();
    intervalRef.current = setInterval(refresh, intervalMs);
    return () => clearInterval(intervalRef.current);
  }, [refresh, intervalMs]);

  return { students, alerts, stats, refresh };
}
