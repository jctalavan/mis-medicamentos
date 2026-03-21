"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdministraciones,
  createAdministracion,
  deleteAdministracion,
} from "@/actions/administraciones";

export function useAdministraciones(medicamentoId: string) {
  return useQuery({
    queryKey: ["administraciones", medicamentoId],
    queryFn: () => getAdministraciones(medicamentoId),
    enabled: !!medicamentoId,
  });
}

export function useCreateAdministracion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { medicamento_id: string; fecha: string; notas?: string }) =>
      createAdministracion(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["administraciones", variables.medicamento_id],
      });
    },
  });
}

export function useDeleteAdministracion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, medicamentoId }: { id: string; medicamentoId: string }) =>
      deleteAdministracion(id).then(() => medicamentoId),
    onSuccess: (medicamentoId) => {
      queryClient.invalidateQueries({
        queryKey: ["administraciones", medicamentoId],
      });
    },
  });
}
