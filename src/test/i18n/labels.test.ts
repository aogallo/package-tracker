import { describe, it, expect } from 'vitest';
import {
  getStatusLabel,
  getStatusLabels,
  getDeliveryTypeLabel,
  getDeliveryTypeLabels,
} from '@/lib/i18n/labels';

describe('getStatusLabel', () => {
  it('returns Spanish label for pending', () => {
    expect(getStatusLabel('es', 'pending')).toBe('Pendiente');
  });

  it('returns English label for pending', () => {
    expect(getStatusLabel('en', 'pending')).toBe('Pending');
  });

  it('returns Spanish label for confirmed', () => {
    expect(getStatusLabel('es', 'confirmed')).toBe('Confirmado');
  });

  it('returns English label for confirmed', () => {
    expect(getStatusLabel('en', 'confirmed')).toBe('Confirmed');
  });

  it('returns Spanish label for in_transit', () => {
    expect(getStatusLabel('es', 'in_transit')).toBe('En Camino');
  });

  it('returns English label for in_transit', () => {
    expect(getStatusLabel('en', 'in_transit')).toBe('In Transit');
  });

  it('returns Spanish label for delivered', () => {
    expect(getStatusLabel('es', 'delivered')).toBe('Entregado');
  });

  it('returns English label for delivered', () => {
    expect(getStatusLabel('en', 'delivered')).toBe('Delivered');
  });

  it('returns Spanish label for picked_up', () => {
    expect(getStatusLabel('es', 'picked_up')).toBe('Recogido');
  });

  it('returns English label for picked_up', () => {
    expect(getStatusLabel('en', 'picked_up')).toBe('Picked Up');
  });

  it('returns Spanish label for canceled', () => {
    expect(getStatusLabel('es', 'canceled')).toBe('Cancelado');
  });

  it('returns English label for canceled', () => {
    expect(getStatusLabel('en', 'canceled')).toBe('Canceled');
  });

  it('falls back to the raw status string for unknown statuses', () => {
    expect(getStatusLabel('es', 'unknown_status')).toBe('unknown_status');
  });
});

describe('getDeliveryTypeLabel', () => {
  it('returns Spanish label for delivery', () => {
    expect(getDeliveryTypeLabel('es', 'delivery')).toBe('Entrega');
  });

  it('returns English label for delivery', () => {
    expect(getDeliveryTypeLabel('en', 'delivery')).toBe('Delivery');
  });

  it('returns Spanish label for pickup', () => {
    expect(getDeliveryTypeLabel('es', 'pickup')).toBe('Recoger');
  });

  it('returns English label for pickup', () => {
    expect(getDeliveryTypeLabel('en', 'pickup')).toBe('Pickup');
  });

  it('falls back to uppercase raw value for unknown types', () => {
    expect(getDeliveryTypeLabel('es', 'other_type')).toBe('OTHER_TYPE');
  });
});

describe('getStatusLabels', () => {
  it('returns all status labels in Spanish', () => {
    const labels = getStatusLabels('es');
    expect(labels.pending).toBe('Pendiente');
    expect(labels.confirmed).toBe('Confirmado');
    expect(labels.in_transit).toBe('En Camino');
    expect(labels.delivered).toBe('Entregado');
    expect(labels.picked_up).toBe('Recogido');
    expect(labels.canceled).toBe('Cancelado');
  });

  it('returns all status labels in English', () => {
    const labels = getStatusLabels('en');
    expect(labels.pending).toBe('Pending');
    expect(labels.confirmed).toBe('Confirmed');
    expect(labels.in_transit).toBe('In Transit');
    expect(labels.delivered).toBe('Delivered');
    expect(labels.picked_up).toBe('Picked Up');
    expect(labels.canceled).toBe('Canceled');
  });
});

describe('getDeliveryTypeLabels', () => {
  it('returns all delivery type labels in Spanish', () => {
    const labels = getDeliveryTypeLabels('es');
    expect(labels.delivery).toBe('Entrega');
    expect(labels.pickup).toBe('Recoger');
  });

  it('returns all delivery type labels in English', () => {
    const labels = getDeliveryTypeLabels('en');
    expect(labels.delivery).toBe('Delivery');
    expect(labels.pickup).toBe('Pickup');
  });
});
