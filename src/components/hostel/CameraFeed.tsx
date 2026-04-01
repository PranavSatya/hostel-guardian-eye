import { Camera } from "lucide-react";

export default function CameraFeed() {
  return (
    <div className="glass-card">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Camera className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Live Monitoring</h3>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="pulse-dot-green" />
          <span className="text-xs text-muted-foreground">ESP32-CAM Ready</span>
        </div>
      </div>
      <div className="p-4">
        <div className="aspect-video rounded-lg bg-secondary/30 border border-border flex items-center justify-center overflow-hidden">
          {/* Replace src with your ESP32-CAM stream URL */}
          {/* <iframe src="http://192.168.1.10:81/stream" className="w-full h-full" /> */}
          <div className="text-center space-y-2">
            <Camera className="w-12 h-12 text-muted-foreground/30 mx-auto" />
            <p className="text-muted-foreground text-sm">Camera feed will appear here</p>
            <p className="text-muted-foreground/60 text-xs font-mono">Connect ESP32-CAM at http://192.168.1.10:81/stream</p>
          </div>
        </div>
      </div>
    </div>
  );
}
