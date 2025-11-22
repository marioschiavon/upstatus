import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import AuthModal from './AuthModal';

interface Service {
  id: string;
  name: string;
  price_per_1000: number;
  min_quantity: number;
  max_quantity: number;
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
}

export default function OrderModal({ isOpen, onClose, service }: OrderModalProps) {
  const { user } = useAuth();
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState(service.min_quantity);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLink('');
      setQuantity(service.min_quantity);
      setError('');
      setSuccess(false);
    }
  }, [isOpen, service.min_quantity]);

  if (!isOpen) return null;

  const calculatePrice = () => {
    return ((quantity / 1000) * service.price_per_1000).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (quantity < service.min_quantity || quantity > service.max_quantity) {
      setError(`Quantidade deve estar entre ${service.min_quantity} e ${service.max_quantity}`);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const totalPrice = (quantity / 1000) * service.price_per_1000;

      const { error: orderError } = await supabase.from('orders').insert({
        user_id: user.id,
        service_id: service.id,
        link,
        quantity,
        total_price: totalPrice,
        status: 'pending',
      });

      if (orderError) throw orderError;

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">{service.name}</h2>
          <p className="text-sm text-gray-600 mb-6">
            Preço: R$ {service.price_per_1000.toFixed(2)} por 1000
          </p>

          {success ? (
            <div className="bg-green-50 text-green-800 p-4 rounded-lg text-center">
              <p className="font-semibold">Pedido criado com sucesso!</p>
              <p className="text-sm">Você será redirecionado em breve...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link do Post ou Perfil
                </label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Cole o link completo do seu post ou perfil
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || service.min_quantity)}
                  min={service.min_quantity}
                  max={service.max_quantity}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Min: {service.min_quantity} | Max: {service.max_quantity.toLocaleString()}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    R$ {calculatePrice()}
                  </span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processando...' : 'Confirmar Pedido'}
              </button>

              {!user && (
                <p className="text-sm text-gray-600 text-center">
                  Você precisa estar logado para fazer um pedido
                </p>
              )}
            </form>
          )}
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
