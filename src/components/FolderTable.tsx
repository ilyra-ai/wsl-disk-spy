import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Folder } from "lucide-react";
import { FolderData } from "./DiskAnalyzer";

interface FolderTableProps {
  folders: FolderData[];
}

const FolderTable = ({ folders }: FolderTableProps) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortedFolders = [...folders].sort((a, b) => {
    return sortOrder === "desc" ? b.size - a.size : a.size - b.size;
  });

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const totalSize = folders.reduce((acc, f) => acc + f.size, 0);
  const formatBytes = (bytes: number) => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Folder className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-semibold text-foreground">
            Todas as Pastas ({folders.length})
          </h2>
        </div>
        <div className="text-sm text-muted-foreground">
          Total: <span className="text-accent font-semibold">{formatBytes(totalSize)}</span>
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="text-foreground font-semibold">Caminho</TableHead>
              <TableHead
                className="text-right cursor-pointer hover:text-accent transition-colors select-none"
                onClick={toggleSort}
              >
                <div className="flex items-center justify-end gap-2">
                  Tamanho
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead className="text-right text-foreground font-semibold">
                % do Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedFolders.map((folder, index) => {
              const percentage = ((folder.size / totalSize) * 100).toFixed(2);

              return (
                <TableRow
                  key={`${folder.path}-${index}`}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-mono text-sm text-foreground">
                    {folder.path}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-accent">
                    {folder.sizeFormatted}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {percentage}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default FolderTable;
