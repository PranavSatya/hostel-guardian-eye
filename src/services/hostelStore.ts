// In-memory data store simulating backend
// Each function mirrors a REST API endpoint for easy future migration

export interface Student {
  uid: string;
  name: string;
  status: "IN" | "OUT";
  lastScanTime: number;
  exitTime: number | null;
  hasReturnedEvening: boolean; // tracks if student returned in evening
  alertTriggered: boolean;
  extensionRequested: boolean;
  extensionApproved: boolean;
}

export interface Alert {
  id: string;
  uid: string;
  studentName: string;
  message: string;
  timestamp: number;
  resolved: boolean;
}

// In-memory store
let students: Student[] = [
  { uid: "A1B2C3D4", name: "Rahul Sharma", status: "IN", lastScanTime: Date.now(), exitTime: null, hasReturnedEvening: true, alertTriggered: false, extensionRequested: false, extensionApproved: false },
  { uid: "E5F6G7H8", name: "Priya Patel", status: "OUT", lastScanTime: Date.now() - 300000, exitTime: Date.now() - 300000, hasReturnedEvening: true, alertTriggered: false, extensionRequested: false, extensionApproved: false },
  { uid: "I9J0K1L2", name: "Amit Kumar", status: "IN", lastScanTime: Date.now(), exitTime: null, hasReturnedEvening: false, alertTriggered: false, extensionRequested: false, extensionApproved: false },
  { uid: "M3N4O5P6", name: "Sneha Reddy", status: "OUT", lastScanTime: Date.now() - 700000, exitTime: Date.now() - 700000, hasReturnedEvening: true, alertTriggered: true, extensionRequested: true, extensionApproved: false },
];

let alerts: Alert[] = [
  { id: "alert-1", uid: "M3N4O5P6", studentName: "Sneha Reddy", message: "Student exceeded 10-minute allowed time outside", timestamp: Date.now() - 100000, resolved: false },
];

let nextAlertId = 2;

// === API-equivalent functions ===

// POST /api/warden/add
export function addStudent(name: string, uid: string): { success: boolean; message: string } {
  if (students.find(s => s.uid === uid)) {
    return { success: false, message: "Student with this UID already exists" };
  }
  students.push({
    uid,
    name,
    status: "IN",
    lastScanTime: Date.now(),
    exitTime: null,
    hasReturnedEvening: false,
    alertTriggered: false,
    extensionRequested: false,
    extensionApproved: false,
  });
  return { success: true, message: "Student added successfully" };
}

// GET /api/warden/students
export function getAllStudents(): Student[] {
  return [...students];
}

// POST /api/scan
export function scanRFID(uid: string): { success: boolean; student?: Student; message: string } {
  const student = students.find(s => s.uid === uid);
  if (!student) {
    return { success: false, message: "Unknown RFID UID" };
  }

  const now = Date.now();

  if (student.status === "IN") {
    // Going OUT
    student.status = "OUT";
    student.exitTime = now;
    student.lastScanTime = now;
    student.alertTriggered = false;
    student.extensionRequested = false;
    student.extensionApproved = false;
  } else {
    // Coming IN
    student.status = "IN";
    student.exitTime = null;
    student.lastScanTime = now;
    student.hasReturnedEvening = true;
    student.alertTriggered = false;
    student.extensionRequested = false;
    student.extensionApproved = false;
    // Resolve related alerts
    alerts = alerts.map(a => a.uid === uid ? { ...a, resolved: true } : a);
  }

  return { success: true, student: { ...student }, message: `Student ${student.name} is now ${student.status}` };
}

// GET /api/student/:uid
export function getStudent(uid: string): Student | null {
  return students.find(s => s.uid === uid) || null;
}

// POST /api/student/request
export function requestExtension(uid: string): { success: boolean; message: string } {
  const student = students.find(s => s.uid === uid);
  if (!student) return { success: false, message: "Student not found" };
  student.extensionRequested = true;
  return { success: true, message: "Extension requested" };
}

// POST /api/warden/approve
export function approveExtension(uid: string): { success: boolean; message: string } {
  const student = students.find(s => s.uid === uid);
  if (!student) return { success: false, message: "Student not found" };
  student.extensionApproved = true;
  student.extensionRequested = false;
  student.alertTriggered = false;
  student.exitTime = Date.now(); // Reset timer
  // Resolve alerts
  alerts = alerts.map(a => a.uid === uid && !a.resolved ? { ...a, resolved: true } : a);
  return { success: true, message: "Extension approved" };
}

// GET /api/warden/alerts
export function getAlerts(): Alert[] {
  return [...alerts];
}

// Timer service - runs checks (call with setInterval)
export function runTimerCheck(): void {
  const now = Date.now();
  const TEN_MINUTES = 10 * 60 * 1000;

  students.forEach(student => {
    if (
      student.status === "OUT" &&
      student.hasReturnedEvening &&
      student.exitTime &&
      !student.alertTriggered &&
      !student.extensionApproved &&
      now - student.exitTime > TEN_MINUTES
    ) {
      student.alertTriggered = true;
      const alertId = `alert-${nextAlertId++}`;
      alerts.push({
        id: alertId,
        uid: student.uid,
        studentName: student.name,
        message: "Student exceeded 10-minute allowed time outside",
        timestamp: now,
        resolved: false,
      });
    }
  });
}

// Stats
export function getStats() {
  const total = students.length;
  const inside = students.filter(s => s.status === "IN").length;
  const outside = students.filter(s => s.status === "OUT").length;
  const activeAlerts = alerts.filter(a => !a.resolved).length;
  return { total, inside, outside, activeAlerts };
}

// Remove student
export function removeStudent(uid: string): { success: boolean } {
  const idx = students.findIndex(s => s.uid === uid);
  if (idx === -1) return { success: false };
  students.splice(idx, 1);
  alerts = alerts.filter(a => a.uid !== uid);
  return { success: true };
}
