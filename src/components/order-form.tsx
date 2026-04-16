'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Trash2, Search } from 'lucide-react';

interface Client {
  id: number;
  name: string;
  email: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  description: string;
  url: string;
}

interface OrderFormProps {
  clients: Client[];
  action: (data: FormData) => Promise<void>;
}

export function OrderForm({ clients, action }: OrderFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('guest');
  const [clientSearch, setClientSearch] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [items, setItems] = useState<OrderItem[]>([
    { name: '', quantity: 1, description: '', url: '' },
  ]);

  const isRegisteredClient = selectedClientId !== 'guest';

  const filteredClients = useMemo(() => {
    if (!clientSearch) return clients;
    const search = clientSearch.toLowerCase();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(search) || client.email.toLowerCase().includes(search)
    );
  }, [clients, clientSearch]);

  const selectedClient = useMemo(
    () => clients.find((c) => c.id.toString() === selectedClientId),
    [clients, selectedClientId]
  );

  function handleClientSelect(value: string | null) {
    setSelectedClientId(value || 'guest');
  }

  function handleClientSearch(value: string) {
    setClientSearch(value);
    // If typing a number, try to match client ID
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      const match = clients.find((c) => c.id === numValue);
      if (match) {
        setSelectedClientId(numValue.toString());
      }
    }
  }

  function addItem() {
    setItems([...items, { name: '', quantity: 1, description: '', url: '' }]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof OrderItem, value: string | number) {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    // Add items as JSON
    formData.set('items', JSON.stringify(items));

    // Add client ID if selected
    if (selectedClientId !== 'guest') {
      formData.set('clientId', selectedClientId);
    }

    try {
      await action(formData);
      toast.success('Orden creada');
      router.push('/admin/orders');
      router.refresh();
    } catch (error) {
      toast.error('Error al crear la orden');
      console.error('Order creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Crear Nueva Orden</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Selection with Search */}
          <div className="space-y-2">
            <Label>Tipo de Cliente</Label>
            <div className="space-y-2">
              <Input
                placeholder="Buscar cliente por nombre o email..."
                value={clientSearch}
                onChange={(e) => handleClientSearch(e.target.value)}
                className="mb-2"
              />
              <Select value={selectedClientId} onValueChange={(val) => handleClientSelect(val)}>
                <SelectTrigger>
                  <SelectValue>
                    {selectedClient ? (
                      <span>
                        {selectedClient.name} ({selectedClient.email})
                      </span>
                    ) : selectedClientId === 'guest' ? (
                      'Invitado (Sin Cuenta)'
                    ) : (
                      'Seleccionar cliente...'
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guest">Invitado (Sin Cuenta)</SelectItem>
                  {filteredClients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{client.name}</span>
                        <span className="text-xs text-muted-foreground">{client.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Guest Fields (if not registered client) */}
          {!isRegisteredClient && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guestName">Nombre del Invitado *</Label>
                  <Input
                    id="guestName"
                    name="guestName"
                    type="text"
                    required={!isRegisteredClient}
                    placeholder="Ingrese nombre del invitado"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guestEmail">Email del Invitado *</Label>
                  <Input
                    id="guestEmail"
                    name="guestEmail"
                    type="email"
                    required={!isRegisteredClient}
                    placeholder="invitado@ejemplo.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestPhone">Teléfono del Invitado</Label>
                <Input id="guestPhone" name="guestPhone" type="tel" placeholder="+502 1234-5678" />
              </div>
            </>
          )}

          {/* Delivery Type */}
          <div className="space-y-2">
            <Label>Tipo de Entrega</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="deliveryType"
                  value="delivery"
                  checked={deliveryType === 'delivery'}
                  onChange={() => setDeliveryType('delivery')}
                />
                <span>Entrega a Domicilio</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="deliveryType"
                  value="pickup"
                  checked={deliveryType === 'pickup'}
                  onChange={() => setDeliveryType('pickup')}
                />
                <span>Recoger en Tienda</span>
              </label>
            </div>
          </div>

          {/* Delivery Address (if delivery) */}
          {deliveryType === 'delivery' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="deliveryAddress">Dirección de Entrega</Label>
                <Input
                  id="deliveryAddress"
                  name="deliveryAddress"
                  type="text"
                  placeholder="123 Calle Principal, Zona 1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryCity">Ciudad</Label>
                <Input
                  id="deliveryCity"
                  name="deliveryCity"
                  type="text"
                  placeholder="Ciudad de Guatemala"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryZip">Código Postal</Label>
                <Input id="deliveryZip" name="deliveryZip" type="text" placeholder="01001" />
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <textarea
              id="notes"
              name="notes"
              className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Instrucciones especiales..."
            />
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Artículos de la Orden</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" />
                Agregar Artículo
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="flex gap-4 items-start p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Nombre del artículo"
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    required
                    className="font-medium"
                  />
                  <Input
                    placeholder="Descripción (opcional)"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                  />
                  <Input
                    placeholder="URL del producto (opcional)"
                    type="url"
                    value={item.url}
                    onChange={(e) => updateItem(index, 'url', e.target.value)}
                  />
                </div>
                <div className="w-24 space-y-2">
                  <Label className="text-xs">Cant.</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-6"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear Orden'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/admin/orders')}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
