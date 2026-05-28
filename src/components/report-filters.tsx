'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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

const STATUS_KEY_MAP: Record<string, string> = {
  pending: 'filters.statusPending',
  confirmed: 'filters.statusConfirmed',
  in_transit: 'filters.statusInTransit',
  delivered: 'filters.statusDelivered',
  picked_up: 'filters.statusPickedUp',
  canceled: 'filters.statusCanceled',
};

type ReportFiltersProps = {
  onApply: (filters: FilterState) => void;
  clients: Array<{ id: number; name: string }>;
  initialFilters?: FilterState;
};

export function ReportFilters({ onApply, clients, initialFilters }: ReportFiltersProps) {
  const t = useTranslations('admin.reports');
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
            {t('filters.dateFrom')}
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
            {t('filters.dateTo')}
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
            {t('filters.client')}
          </Label>
          <Select value={filters.clientId} onValueChange={handleSelectChange('clientId')}>
            <SelectTrigger id="clientId">
              <SelectValue placeholder={t('filters.allClients')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.allClients')}</SelectItem>
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
            {t('filters.status')}
          </Label>
          <Select value={filters.status} onValueChange={handleSelectChange('status')}>
            <SelectTrigger id="status">
              <SelectValue placeholder={t('filters.allStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.allStatuses')}</SelectItem>
              <SelectItem value="pending">{t('filters.statusPending')}</SelectItem>
              <SelectItem value="confirmed">{t('filters.statusConfirmed')}</SelectItem>
              <SelectItem value="in_transit">{t('filters.statusInTransit')}</SelectItem>
              <SelectItem value="delivered">{t('filters.statusDelivered')}</SelectItem>
              <SelectItem value="picked_up">{t('filters.statusPickedUp')}</SelectItem>
              <SelectItem value="canceled">{t('filters.statusCanceled')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex items-end gap-2">
          <Button onClick={handleApply} className="flex-1">
            {t('filters.applyButton')}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            {t('filters.clearButton')}
          </Button>
        </div>
      </div>
    </div>
  );
}
