import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HardDrive, Upload, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import DiskChart from "./DiskChart";
import FolderTable from "./FolderTable";

export interface FolderData {
  path: string;
  size: number;
  sizeFormatted: string;
}

const DiskAnalyzer = () => {
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [inputData, setInputData] = useState("");

  const parseInput = (data: string) => {
    const lines = data.trim().split("\n");
    const parsed: FolderData[] = [];

    lines.forEach((line) => {
      // Parse format: "size path" (e.g., "1.5G /usr")
      const match = line.match(/^(\S+)\s+(.+)$/);
      if (match) {
        const [, sizeStr, path] = match;
        const size = convertToBytes(sizeStr);
        parsed.push({
          path,
          size,
          sizeFormatted: sizeStr,
        });
      }
    });

    return parsed.sort((a, b) => b.size - a.size);
  };

  const convertToBytes = (sizeStr: string): number => {
    const units: { [key: string]: number } = {
      K: 1024,
      M: 1024 ** 2,
      G: 1024 ** 3,
      T: 1024 ** 4,
    };

    const match = sizeStr.match(/^([\d.]+)([KMGT])?/i);
    if (!match) return 0;

    const value = parseFloat(match[1]);
    const unit = match[2]?.toUpperCase();

    return unit ? value * units[unit] : value;
  };

  const handleAnalyze = () => {
    if (!inputData.trim()) {
      toast.error("Cole os dados de análise do disco");
      return;
    }

    try {
      const parsed = parseInput(inputData);
      if (parsed.length === 0) {
        toast.error("Nenhum dado válido encontrado");
        return;
      }

      setFolders(parsed);
      toast.success(`${parsed.length} pastas analisadas`);
    } catch (error) {
      toast.error("Erro ao processar dados");
      console.error(error);
    }
  };

  const handleClear = () => {
    setFolders([]);
    setInputData("");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-accent">
              <HardDrive className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
            Analisador de Disco WSL2
          </h1>
          <p className="text-muted-foreground text-lg">
            Visualize o uso de espaço do seu sistema
          </p>
        </div>

        {/* Instructions Card */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-start gap-4">
            <FolderOpen className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Como usar:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>
                  Execute no terminal WSL2:{" "}
                  <code className="px-2 py-1 bg-muted rounded text-accent">
                    sudo du -sh /* 2&gt;/dev/null
                  </code>
                </li>
                <li>Copie a saída do comando</li>
                <li>Cole no campo abaixo e clique em "Analisar"</li>
              </ol>
            </div>
          </div>
        </Card>

        {/* Input Card */}
        <Card className="p-6 bg-card border-border">
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">
              Cole os dados do comando du:
            </label>
            <Textarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="1.5G    /usr&#10;892M    /var&#10;512M    /home&#10;..."
              className="min-h-[200px] font-mono text-sm bg-background border-border"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAnalyze}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              >
                <Upload className="w-4 h-4 mr-2" />
                Analisar
              </Button>
              {folders.length > 0 && (
                <Button onClick={handleClear} variant="outline">
                  Limpar
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Results */}
        {folders.length > 0 && (
          <div className="space-y-6">
            <DiskChart folders={folders.slice(0, 10)} />
            <FolderTable folders={folders} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DiskAnalyzer;
