import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Use default Helvetica font - no custom font registration needed
// This avoids issues with Google Fonts CDN URLs that @react-pdf/renderer cannot fetch

const styles = StyleSheet.create({
  page: {
    padding: 30,
    // fontFamily defaults to Helvetica
    fontSize: 11,
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 15,
  },
  logo: {
    fontSize: 22,
    fontWeight: 700,
    color: '#2563eb',
  },
  companyName: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  ticketTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#333',
  },
  trackingSection: {
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 8,
  },
  trackingLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  trackingNumber: {
    fontSize: 26,
    fontWeight: 700,
    color: '#1e40af',
    letterSpacing: 2,
  },
  statusBadge: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 9,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  statusConfirmed: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
  },
  statusInTransit: {
    backgroundColor: '#ede9fe',
    color: '#5b21b6',
  },
  statusDelivered: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  statusCanceled: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  infoGrid: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoColumn: {
    flex: 1,
  },
  infoBlock: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 8,
    color: '#666',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 11,
    fontWeight: 700,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#333',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  itemsTable: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    padding: 8,
    borderRadius: 4,
    marginBottom: 5,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tableCell: {
    fontSize: 10,
    color: '#333',
  },
  colItem: {
    flex: 2,
  },
  colQty: {
    flex: 1,
    textAlign: 'center',
  },
  colDesc: {
    flex: 2,
  },
  colUrl: {
    flex: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  qrSection: {
    alignItems: 'center',
  },
  qrLabel: {
    fontSize: 8,
    color: '#666',
    marginTop: 5,
  },
  timestamp: {
    fontSize: 8,
    color: '#999',
    textAlign: 'right',
  },
  deliveryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 9,
    fontWeight: 700,
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
  },
  guestLabel: {
    fontSize: 8,
    color: '#666',
    marginTop: 2,
  },
});

type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  description: string | null;
  url: string | null;
};

type TicketTemplateProps = {
  trackingNumber: string;
  guestName: string;
  guestEmail: string;
  deliveryType: 'delivery' | 'pickup';
  status: string;
  items: OrderItem[];
  qrCodeDataUrl: string;
  createdAt: Date;
  deliveryAddress?: string | null;
  deliveryCity?: string | null;
  companyName?: string;
};

function getStatusStyle(status: string) {
  switch (status) {
    case 'pending':
      return styles.statusPending;
    case 'confirmed':
      return styles.statusConfirmed;
    case 'in_transit':
      return styles.statusInTransit;
    case 'delivered':
    case 'picked_up':
      return styles.statusDelivered;
    case 'canceled':
      return styles.statusCanceled;
    default:
      return styles.statusPending;
  }
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  in_transit: 'En Camino',
  delivered: 'Entregado',
  picked_up: 'Recogido',
  canceled: 'Cancelado',
};

const deliveryTypeLabels: Record<string, string> = {
  delivery: 'ENTREGA',
  pickup: 'RECOGER',
};

export function TicketTemplate({
  trackingNumber,
  guestName,
  guestEmail,
  deliveryType,
  status,
  items,
  qrCodeDataUrl,
  createdAt,
  deliveryAddress,
  deliveryCity,
  companyName = 'Package Tracker',
}: TicketTemplateProps) {
  return (
    <Document>
      <Page size="A5" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>{companyName.toUpperCase()}</Text>
            <Text style={styles.companyName}>Entrega Rápida y Confiable</Text>
          </View>
          <Text style={styles.ticketTitle}>TICKET</Text>
        </View>

        {/* Tracking Number Section */}
        <View style={styles.trackingSection}>
          <Text style={styles.trackingLabel}>Número de Seguimiento</Text>
          <Text style={styles.trackingNumber}>{trackingNumber}</Text>
          <Text style={[styles.statusBadge, getStatusStyle(status)]}>
            {statusLabels[status] || status}
          </Text>
        </View>

        {/* Customer & Delivery Info */}
        <View style={styles.infoGrid}>
          <View style={styles.infoColumn}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Destinatario</Text>
              <Text style={styles.infoValue}>{guestName}</Text>
              <Text style={styles.guestLabel}>{guestEmail}</Text>
            </View>
          </View>
          <View style={styles.infoColumn}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Tipo de Entrega</Text>
              <Text style={styles.deliveryBadge}>
                {deliveryTypeLabels[deliveryType] || deliveryType.toUpperCase()}
              </Text>
            </View>
            {deliveryType === 'delivery' && deliveryAddress && (
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Dirección</Text>
                <Text style={styles.infoValue}>{deliveryAddress}</Text>
                {deliveryCity && <Text style={styles.infoValue}>{deliveryCity}</Text>}
              </View>
            )}
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.itemsTable}>
          <Text style={styles.sectionTitle}>Artículos de la Orden</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colItem]}>Artículo</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Cant.</Text>
            <Text style={[styles.tableHeaderCell, styles.colDesc]}>Descripción</Text>
            <Text style={[styles.tableHeaderCell, styles.colUrl]}>URL</Text>
          </View>
          {items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colItem]}>{item.name}</Text>
              <Text style={[styles.tableCell, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.colDesc]}>{item.description || '-'}</Text>
              <Text style={[styles.tableCell, styles.colUrl]}>{item.url ? 'Ver' : '-'}</Text>
            </View>
          ))}
          {items.length === 0 && (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { textAlign: 'center' }]}>Sin artículos</Text>
            </View>
          )}
        </View>

        {/* Footer with QR and Timestamp */}
        <View style={styles.footer}>
          <View style={styles.qrSection}>
            {qrCodeDataUrl && <Image src={qrCodeDataUrl} style={{ width: 80, height: 80 }} />}
            <Text style={styles.qrLabel}>Escanea para rastrear tu paquete</Text>
          </View>
          <View>
            <Text style={styles.timestamp}>Generado: {format(createdAt, 'dd MMM yyyy HH:mm')}</Text>
            <Text style={styles.timestamp}>Fecha de Orden: {format(createdAt, 'dd MMM yyyy')}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
