import { useState } from "react";
import { addStudent } from "@/services/hostelStore";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

interface AddStudentFormProps {
  onRefresh: () => void;
}

export default function AddStudentForm({ onRefresh }: AddStudentFormProps) {
  const [name, setName] = useState("");
  const [uid, setUid] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !uid.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    const result = addStudent(name.trim(), uid.trim().toUpperCase());
    if (result.success) {
      toast.success(result.message);
      setName("");
      setUid("");
      onRefresh();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="glass-card">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <UserPlus className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Register Student</h3>
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
        <input
          type="text"
          placeholder="RFID UID"
          value={uid}
          onChange={e => setUid(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Add Student
        </button>
      </form>
    </div>
  );
}
