/**
 * Centralized locale-aware label maps
 *
 * Single source of truth for status and delivery type labels.
 * All admin pages, components, and the PDF ticket use these functions.
 *
 * The status labels use short title-case forms for use in tables,
 * badges, dropdowns, and the PDF ticket.
 *
 * Delivery type labels use short title-case forms.
 * The PDF ticket applies its own uppercase styling.
 */

const statusLabelMap: Record<string, { es: string; en: string }> = {
  pending: { es: 'Pendiente', en: 'Pending' },
  confirmed: { es: 'Confirmado', en: 'Confirmed' },
  in_transit: { es: 'En Camino', en: 'In Transit' },
  delivered: { es: 'Entregado', en: 'Delivered' },
  picked_up: { es: 'Recogido', en: 'Picked Up' },
  canceled: { es: 'Cancelado', en: 'Canceled' },
};

const deliveryTypeLabelMap: Record<string, { es: string; en: string }> = {
  delivery: { es: 'Entrega', en: 'Delivery' },
  pickup: { es: 'Recoger', en: 'Pickup' },
};

/**
 * Returns the locale-aware label for an order status.
 * Falls back to the raw status string for unknown statuses.
 */
export function getStatusLabel(locale: string, status: string): string {
  const entry = statusLabelMap[status];
  if (!entry) return status;
  return entry[locale as 'es' | 'en'] || status;
}

/**
 * Returns a complete map of status → label for the given locale.
 * Useful for iterating over all statuses (e.g. in dropdown selects).
 */
export function getStatusLabels(locale: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(statusLabelMap)) {
    result[key] = value[locale as 'es' | 'en'] || key;
  }
  return result;
}

/**
 * Returns the locale-aware label for a delivery type.
 * Falls back to the uppercase raw value for unknown types.
 */
export function getDeliveryTypeLabel(locale: string, type: string): string {
  const entry = deliveryTypeLabelMap[type];
  if (!entry) return type.toUpperCase();
  return entry[locale as 'es' | 'en'] || type.toUpperCase();
}

/**
 * Returns a complete map of delivery type → label for the given locale.
 */
export function getDeliveryTypeLabels(locale: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(deliveryTypeLabelMap)) {
    result[key] = value[locale as 'es' | 'en'] || key;
  }
  return result;
}
