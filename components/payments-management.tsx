"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Euro, Calendar, User, CreditCard } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Registration {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  category: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
}

interface PaymentsManagementProps {
  initialRegistrations: Registration[];
}

export function PaymentsManagement({ initialRegistrations }: PaymentsManagementProps) {
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentNote, setPaymentNote] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleValidatePayment = (registration: Registration) => {
    setSelectedRegistration(registration);
    setIsDialogOpen(true);
  };

  const confirmPayment = async () => {
    if (!selectedRegistration) return;

    setIsProcessing(true);

    try {
      const response = await fetch(`/api/admin/validate-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: selectedRegistration.id,
          paymentDate,
          paymentNote,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la validation");
      }

      // Mettre à jour la liste
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === selectedRegistration.id
            ? { ...r, payment_status: "paid" }
            : r
        )
      );

      setIsDialogOpen(false);
      setPaymentNote("");
      setSelectedRegistration(null);
    } catch (error) {
      console.error("Error validating payment:", error);
      alert("Erreur lors de la validation du paiement");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelPayment = async (registrationId: string) => {
    if (!confirm("Voulez-vous vraiment annuler cette inscription ?")) return;

    try {
      const response = await fetch(`/api/admin/cancel-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'annulation");
      }

      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === registrationId ? { ...r, payment_status: "cancelled" } : r
        )
      );
    } catch (error) {
      console.error("Error canceling payment:", error);
      alert("Erreur lors de l'annulation");
    }
  };

  const pendingRegistrations = registrations.filter(
    (r) => r.payment_status === "pending"
  );
  const paidRegistrations = registrations.filter(
    (r) => r.payment_status === "paid"
  );

  return (
    <div className="space-y-8">
      {/* Paiements en attente */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Euro className="h-5 w-5 text-amber-600" />
            Paiements en attente ({pendingRegistrations.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Date inscription</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRegistrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Aucun paiement en attente
                  </TableCell>
                </TableRow>
              ) : (
                pendingRegistrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="font-medium">
                      {registration.first_name} {registration.last_name}
                    </TableCell>
                    <TableCell>{registration.email}</TableCell>
                    <TableCell>{registration.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{registration.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          registration.payment_method === "cheque"
                            ? "secondary"
                            : "default"
                        }
                      >
                        {registration.payment_method === "cheque"
                          ? "📝 Chèque"
                          : "💵 Espèces"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(registration.created_at).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleValidatePayment(registration)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Valider
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleCancelPayment(registration.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Annuler
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Paiements validés */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            Paiements validés ({paidRegistrations.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Date inscription</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paidRegistrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Aucun paiement validé
                  </TableCell>
                </TableRow>
              ) : (
                paidRegistrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="font-medium">
                      {registration.first_name} {registration.last_name}
                    </TableCell>
                    <TableCell>{registration.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{registration.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          registration.payment_method === "cheque"
                            ? "secondary"
                            : "default"
                        }
                      >
                        {registration.payment_method === "cheque"
                          ? "📝 Chèque"
                          : "💵 Espèces"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(registration.created_at).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-600">Payé</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog de validation */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Valider le paiement</DialogTitle>
            <DialogDescription>
              Confirmez la réception du paiement pour{" "}
              <strong>
                {selectedRegistration?.first_name} {selectedRegistration?.last_name}
              </strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Date de réception</Label>
              <Input
                id="paymentDate"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentNote">Note (optionnel)</Label>
              <Textarea
                id="paymentNote"
                placeholder="Numéro de chèque, remarques..."
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                rows={3}
              />
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <p className="text-sm text-blue-800">
                <strong>Mode de paiement :</strong>{" "}
                {selectedRegistration?.payment_method === "cheque"
                  ? "Chèque"
                  : "Espèces"}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isProcessing}
            >
              Annuler
            </Button>
            <Button
              onClick={confirmPayment}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? "Validation..." : "Confirmer le paiement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
