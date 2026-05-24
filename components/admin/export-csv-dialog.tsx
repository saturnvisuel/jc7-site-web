"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { Database } from "@/lib/supabase/types";
import Papa from "papaparse";

type Registration = Database["public"]["Tables"]["registrations"]["Row"];

interface ExportCSVDialogProps {
  data: Registration[];
}

interface ColumnConfig {
  key: string;
  label: string;
  getValue: (row: Registration) => string;
}

const allColumns: ColumnConfig[] = [
  { key: "last_name", label: "Nom", getValue: (row) => row.last_name },
  { key: "first_name", label: "Prénom", getValue: (row) => row.first_name },
  { key: "birth_date", label: "Date de naissance", getValue: (row) => row.birth_date },
  { key: "category", label: "Catégorie", getValue: (row) => row.category },
  { key: "belt", label: "Ceinture", getValue: (row) => row.belt || "" },
  { key: "address", label: "Adresse", getValue: (row) => (row as any).address || "" },
  { key: "postal_code", label: "Code postal", getValue: (row) => (row as any).postal_code || "" },
  { key: "city", label: "Ville", getValue: (row) => (row as any).city || "" },
  { key: "phone", label: "Téléphone", getValue: (row) => row.phone },
  { key: "phone_alt", label: "Téléphone 2", getValue: (row) => (row as any).phone_alt || "" },
  { key: "email", label: "Email", getValue: (row) => row.email },
  { key: "social_security_number", label: "N° Sécurité sociale", getValue: (row) => (row as any).social_security_number || "" },
  { key: "guardian_first_name", label: "Prénom responsable", getValue: (row) => (row as any).guardian_first_name || "" },
  { key: "guardian_last_name", label: "Nom responsable", getValue: (row) => (row as any).guardian_last_name || "" },
  { key: "guardian_phone", label: "Téléphone responsable", getValue: (row) => (row as any).guardian_phone || "" },
  { key: "guardian_email", label: "Email responsable", getValue: (row) => (row as any).guardian_email || "" },
  { key: "medical_note", label: "Note médicale", getValue: (row) => row.medical_note || "" },
  { key: "payment_method", label: "Mode de paiement", getValue: (row) => (row as any).payment_method || "" },
  { key: "payment_status", label: "Statut paiement", getValue: (row) => row.payment_status },
  { key: "created_at", label: "Date d'inscription", getValue: (row) => new Date(row.created_at).toLocaleDateString("fr-FR") },
];

export function ExportCSVDialog({ data }: ExportCSVDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    ["last_name", "first_name", "email", "phone", "category", "payment_status", "created_at"]
  );
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const toggleColumn = (columnKey: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((k) => k !== columnKey)
        : [...prev, columnKey]
    );
  };

  const selectAllColumns = () => {
    setSelectedColumns(allColumns.map((col) => col.key));
  };

  const deselectAllColumns = () => {
    setSelectedColumns([]);
  };

  const exportToCSV = () => {
    // Filtrer les données
    let filteredData = data;

    if (paymentStatusFilter !== "all") {
      filteredData = filteredData.filter((row) => row.payment_status === paymentStatusFilter);
    }

    if (categoryFilter !== "all") {
      filteredData = filteredData.filter((row) => row.category === categoryFilter);
    }

    // Créer les données CSV avec les colonnes sélectionnées
    const csvData = filteredData.map((row) => {
      const rowData: Record<string, string> = {};
      
      selectedColumns.forEach((columnKey) => {
        const column = allColumns.find((col) => col.key === columnKey);
        if (column) {
          rowData[column.label] = column.getValue(row);
        }
      });

      return rowData;
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }); // BOM pour Excel
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `inscriptions_jc7_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setOpen(false);
  };

  const categories = Array.from(new Set(data.map((row) => row.category)));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exporter CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Exporter les inscriptions en CSV</DialogTitle>
          <DialogDescription>
            Sélectionnez les colonnes et les filtres pour votre export
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* FILTRES */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Filtres</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Statut de paiement</Label>
                <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="paid">Payé</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              {data.length} inscription(s) au total
              {(paymentStatusFilter !== "all" || categoryFilter !== "all") && (
                <span className="ml-2">
                  → {
                    data.filter((row) => 
                      (paymentStatusFilter === "all" || row.payment_status === paymentStatusFilter) &&
                      (categoryFilter === "all" || row.category === categoryFilter)
                    ).length
                  } après filtrage
                </span>
              )}
            </div>
          </div>

          {/* COLONNES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Colonnes à exporter ({selectedColumns.length})</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={selectAllColumns}>
                  Tout sélectionner
                </Button>
                <Button variant="ghost" size="sm" onClick={deselectAllColumns}>
                  Tout désélectionner
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4 border rounded-lg max-h-[300px] overflow-y-auto">
              {allColumns.map((column) => (
                <div key={column.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={column.key}
                    checked={selectedColumns.includes(column.key)}
                    onCheckedChange={() => toggleColumn(column.key)}
                  />
                  <Label
                    htmlFor={column.key}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {column.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={exportToCSV} disabled={selectedColumns.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Exporter ({selectedColumns.length} colonnes)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
