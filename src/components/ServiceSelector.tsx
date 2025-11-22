import { useEffect, useState } from 'react';
import { Instagram, Facebook, Youtube, Twitter, Video } from 'lucide-react';
import { supabase } from '../lib/supabase';
import OrderModal from './OrderModal';

interface Platform {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

interface Category {
  id: string;
  platform_id: string;
  name: string;
  slug: string;
}

interface Service {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price_per_1000: number;
  min_quantity: number;
  max_quantity: number;
}

const iconMap: Record<string, typeof Instagram> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  twitter: Twitter,
  video: Video,
  twitch: Video,
};

export default function ServiceSelector() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    loadPlatforms();
  }, []);

  useEffect(() => {
    if (selectedPlatform) {
      loadCategories(selectedPlatform);
      setSelectedCategory(null);
      setServices([]);
    }
  }, [selectedPlatform]);

  useEffect(() => {
    if (selectedCategory) {
      loadServices(selectedCategory);
    }
  }, [selectedCategory]);

  const loadPlatforms = async () => {
    const { data } = await supabase
      .from('platforms')
      .select('*')
      .eq('active', true)
      .order('order_position');

    if (data) setPlatforms(data);
  };

  const loadCategories = async (platformId: string) => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('platform_id', platformId)
      .eq('active', true);

    if (data) setCategories(data);
  };

  const loadServices = async (categoryId: string) => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('category_id', categoryId)
      .eq('active', true);

    if (data) setServices(data);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setIsOrderModalOpen(true);
  };

  return (
    <>
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Escolha Seu Serviço
            </h2>
            <p className="text-lg text-gray-600">
              Selecione a plataforma e o serviço desejado
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                1. Selecione a Plataforma
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {platforms.map((platform) => {
                  const Icon = iconMap[platform.icon] || Instagram;
                  return (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`p-6 rounded-xl border-2 transition-all hover:shadow-md ${
                        selectedPlatform === platform.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <Icon className={`mx-auto mb-2 ${
                        selectedPlatform === platform.id ? 'text-blue-600' : 'text-gray-600'
                      }`} size={32} />
                      <p className="text-sm font-medium text-gray-900">{platform.name}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedPlatform && categories.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  2. Escolha a Categoria
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                        selectedCategory === category.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{category.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedCategory && services.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  3. Selecione o Serviço
                </h3>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="p-6 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                          <h4 className="font-semibold text-gray-900 mb-2">{service.name}</h4>
                          {service.description && (
                            <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span>Min: {service.min_quantity}</span>
                            <span>Max: {service.max_quantity.toLocaleString()}</span>
                            <span className="font-semibold text-blue-600">
                              R$ {service.price_per_1000.toFixed(2)} / 1000
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleServiceSelect(service)}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Pedir Agora
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedService && (
        <OrderModal
          isOpen={isOrderModalOpen}
          onClose={() => {
            setIsOrderModalOpen(false);
            setSelectedService(null);
          }}
          service={selectedService}
        />
      )}
    </>
  );
}
