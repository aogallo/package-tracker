import Link from 'next/link';
import { Package, Truck, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-2xl">
              <Package className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Package Tracker</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Rastrea tus paquetes de manera rápida y sencilla. Ingresa tu número de seguimiento y
            conoce el estado de tu envío.
          </p>
        </div>

        {/* Quick Track Form */}
        <div className="max-w-xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Rastrear mi paquete
            </h2>
            <form action="/track" method="get" className="space-y-4">
              <div>
                <input
                  type="text"
                  name="trackingNumber"
                  id="trackingNumber"
                  placeholder="Ingresa tu número de seguimiento"
                  className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg font-bold py-4"
              >
                <Search className="w-5 h-5 mr-2" />
                Rastrear
              </Button>
            </form>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">En Camino</h3>
            <p className="text-gray-600">
              Sigue cada paso de tu paquete desde que sale hasta que llega a su destino.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmado</h3>
            <p className="text-gray-600">
              Tu paquete ha sido recibido y está siendo preparado para el envío.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Entregado</h3>
            <p className="text-gray-600">Tu paquete ha sido entregado exitosamente.</p>
          </div>
        </div>

        {/* Admin Link */}
        <div className="text-center">
          <Link href="/admin">
            <Button variant="outline" className="font-semibold">
              Acceso Administrador
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Package Tracker. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}
