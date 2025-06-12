import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
  data: any[];
  filename: string;
  className?: string;
}

export function ExportButton({ data, filename, className }: ExportButtonProps) {
  const exportToCSV = () => {
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }

    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    let csvContent = headers.join(",") + "\n";
    
    // Add data rows
    data.forEach(item => {
      const row = headers.map(header => {
        // Handle values that might contain commas or quotes
        const value = item[header] !== undefined ? item[header].toString() : "";
        const escapedValue = value.includes(",") || value.includes("\"") || value.includes("\n") 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
        return escapedValue;
      });
      csvContent += row.join(",") + "\n";
    });
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button 
      onClick={exportToCSV} 
      variant="outline" 
      size="sm" 
      className={className}
    >
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  );
}