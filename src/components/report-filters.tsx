'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type FilterState = {
  dateFrom: string;
  dateTo: string;
  clientId: string;
  status: string;
};

type ReportFiltersProps = {
  onApply: (filters: FilterState) => void;
  clients: Array<{ id: number; name: string }>;
  initialFilters?: FilterState;
};

export function ReportFilters({ onApply, clients, initialFilters }: ReportFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: initialFilters?.dateFrom || '',
    dateTo: initialFilters?.dateTo || '',
    clientId: initialFilters?.clientId || 'all',
    status: initialFilters?.status || 'all',
  });

  const handleChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value ?? 'all' }));
  };

  const handleSelectChange = (field: keyof FilterState) => (value: string | null) => {
    setFilters((prev) => ({ ...prev, [field]: value ?? 'all' }));
  };

  const handleApply = () => {
    onApply(filters);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      dateFrom: '',
      dateTo: '',
      clientId: 'all',
      status: 'all',
    };
    setFilters(resetFilters);
    onApply(resetFilters);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Date From */}
        <div className="space-y-1.5">
          <Label htmlFor="dateFrom" className="text-sm font-medium">
            Desde
          </Label>
          <Input
            id="dateFrom"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleChange('dateFrom', e.target.value)}
          />
        </div>

        {/* Date To */}
        <div className="space-y-1.5">
          <Label htmlFor="dateTo" className="text-sm font-medium">
            Hasta
          </Label>
          <Input
            id="dateTo"
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleChange('dateTo', e.target.value)}
          />
        </div>

        {/* Client */}
        <div className="space-y-1.5">
          <Label htmlFor="clientId" className="text-sm font-medium">
            Cliente
          </Label>
          <Select value={filters.clientId} onValueChange={handleSelectChange('clientId')}>
            <SelectTrigger id="clientId">
              <SelectValue placeholder="Todos los Clientes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Clientes</SelectItem>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id.toString()}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <Label htmlFor="status" className="text-sm font-medium">
            Estado
          </Label>
          <Select value={filters.status} onValueChange={handleSelectChange('status')}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Todos los Estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Estados</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="confirmed">Confirmado</SelectItem>
              <SelectItem value="in_transit">En Camino</SelectItem>
              <SelectItem value="delivered">Entregado</SelectItem>
              <SelectItem value="picked_up">Recogido</SelectItem>
              <SelectItem value="canceled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex items-end gap-2">
          <Button onClick={handleApply} className="flex-1">
            Aplicar Filtros
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
}
