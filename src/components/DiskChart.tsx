import { Card } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { FolderData } from "./DiskAnalyzer";

interface DiskChartProps {
  folders: FolderData[];
}

const DiskChart = ({ folders }: DiskChartProps) => {
  const maxSize = Math.max(...folders.map((f) => f.size));

  const colors = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-yellow-500 to-orange-500",
    "from-indigo-500 to-purple-500",
    "from-cyan-500 to-blue-500",
    "from-pink-500 to-rose-500",
    "from-teal-500 to-green-500",
    "from-violet-500 to-purple-500",
  ];

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-accent" />
        <h2 className="text-xl font-semibold text-foreground">
          Top 10 Maiores Pastas
        </h2>
      </div>

      <div className="space-y-4">
        {folders.map((folder, index) => {
          const percentage = (folder.size / maxSize) * 100;

          return (
            <div key={folder.path} className="space-y-2">
              <div className="flex justify-between items-baseline text-sm">
                <span className="text-foreground font-medium truncate max-w-[70%]">
                  {folder.path}
                </span>
                <span className="text-accent font-mono font-bold">
                  {folder.sizeFormatted}
                </span>
              </div>
              <div className="h-8 bg-muted rounded-lg overflow-hidden relative">
                <div
                  className={`h-full bg-gradient-to-r ${colors[index % colors.length]} transition-all duration-1000 ease-out flex items-center justify-end pr-3`}
                  style={{
                    width: `${percentage}%`,
                    animation: `slideIn 0.6s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <span className="text-xs font-semibold text-white">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            width: 0%;
          }
        }
      `}</style>
    </Card>
  );
};

export default DiskChart;
