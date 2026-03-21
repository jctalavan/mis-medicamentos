"use client";

import { useState } from "react";
import {
  useAdministraciones,
  useCreateAdministracion,
  useDeleteAdministracion,
} from "@/hooks/use-administraciones";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, Trash2, Clock, Loader2 } from "lucide-react";

interface HistorialProps {
  medicamentoId: string;
}

export function Historial({ medicamentoId }: HistorialProps) {
  const { data: administraciones, isLoading } =
    useAdministraciones(medicamentoId);
  const createMutation = useCreateAdministracion();
  const deleteMutation = useDeleteAdministracion();
  const [open, setOpen] = useState(false);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [notas, setNotas] = useState("");

  const handleSubmit = () => {
    if (!fecha) return;

    const fechaCompleta = hora
      ? `${fecha}T${hora}:00`
      : `${fecha}T${new Date().toTimeString().slice(0, 5)}:00`;

    createMutation.mutate(
      {
        medicamento_id: medicamentoId,
        fecha: fechaCompleta,
        notas,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setFecha("");
          setHora("");
          setNotas("");
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este registro?")) {
      deleteMutation.mutate({ id, medicamentoId });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Historial de tomas
        </CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Registrar toma</span>
              <span className="sm:hidden">Toma</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar administración</DialogTitle>
              <DialogDescription>
                Indica cuándo tomaste este medicamento.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="admin-fecha">Fecha *</Label>
                  <Input
                    id="admin-fecha"
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-hora">Hora</Label>
                  <Input
                    id="admin-hora"
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-notas">Notas</Label>
                <Textarea
                  id="admin-notas"
                  placeholder="Observaciones opcionales..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!fecha || createMutation.isPending}
              >
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !administraciones?.length ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No hay registros de administración.
          </p>
        ) : (
          <div className="space-y-3">
            {administraciones.map((admin) => (
              <div
                key={admin.id}
                className="flex items-start justify-between gap-3 rounded-lg border p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {format(admin.fecha, "dd 'de' MMMM 'de' yyyy, HH:mm", {
                      locale: es,
                    })}
                  </p>
                  {admin.notas && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {admin.notas}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(admin.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
