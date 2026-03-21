"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMedicamentos,
  getMedicamento,
  createMedicamento,
  updateMedicamento,
  toggleMedicamento,
  deleteMedicamento,
} from "@/actions/medicamentos";
import type { MedicamentoFormData, MedicamentoFilters } from "@/lib/types";

// ─── Queries ───────────────────────────────────────────────────

export function useMedicamentos(filters: MedicamentoFilters) {
  return useQuery({
    queryKey: ["medicamentos", filters],
    queryFn: () => getMedicamentos(filters),
  });
}

export function useMedicamento(id: string) {
  return useQuery({
    queryKey: ["medicamento", id],
    queryFn: () => getMedicamento(id),
    enabled: !!id,
  });
}

// ─── Mutations ─────────────────────────────────────────────────

export function useCreateMedicamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MedicamentoFormData) => createMedicamento(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicamentos"] });
    },
  });
}

export function useUpdateMedicamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MedicamentoFormData }) =>
      updateMedicamento(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["medicamentos"] });
      queryClient.invalidateQueries({ queryKey: ["medicamento", variables.id] });
    },
  });
}

export function useToggleMedicamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, activo }: { id: string; activo: boolean }) =>
      toggleMedicamento(id, activo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicamentos"] });
    },
  });
}

export function useDeleteMedicamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMedicamento(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicamentos"] });
    },
  });
}
