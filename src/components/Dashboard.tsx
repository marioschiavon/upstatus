import { useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Order {
  id: string;
  service_id: string;
  link: string;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
  services: {
    name: string;
  };
}

interface Profile {
  balance: number;
  email: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadOrders();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('balance, email')
      .eq('id', user.id)
      .maybeSingle();

    if (data) setProfile(data);
  };

  const loadOrders = async () => {
    if (!user) return;

    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select(`
        id,
        service_id,
        link,
        quantity,
        total_price,
        status,
        created_at,
        services (name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setOrders(data as Order[]);
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-600" size={20} />;
      case 'processing':
        return <Package className="text-blue-600" size={20} />;
      default:
        return <Clock className="text-yellow-600" size={20} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      case 'processing':
        return 'Processando';
      default:
        return 'Pendente';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Faça login para ver seu painel</p>
      </div>
    );
  }

  return (
    <section id="dashboard" className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Meu Painel</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Saldo Disponível</p>
            <p className="text-3xl font-bold text-blue-600">
              R$ {profile?.balance?.toFixed(2) || '0.00'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Total de Pedidos</p>
            <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="text-lg font-medium text-gray-900">{profile?.email}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Histórico de Pedidos</h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Carregando pedidos...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Você ainda não fez nenhum pedido</p>
              <a
                href="#services"
                className="inline-block mt-4 text-blue-600 hover:underline font-medium"
              >
                Fazer meu primeiro pedido
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serviço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-900">{order.services.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-xs">{order.link}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.quantity.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        R$ {order.total_price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className="text-sm text-gray-900">
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
