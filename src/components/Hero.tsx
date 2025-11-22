import { TrendingUp, Shield, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Impulsione Suas Redes Sociais
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A solução completa para aumentar seu engajamento nas principais plataformas.
            Serviços rápidos, seguros e de qualidade.
          </p>
          <a
            href="#services"
            className="inline-block mt-8 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            INICIAR AGORA
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Crescimento Real
            </h3>
            <p className="text-gray-600">
              Aumente seus seguidores, curtidas e visualizações de forma orgânica e segura.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              100% Seguro
            </h3>
            <p className="text-gray-600">
              Não precisamos de sua senha. Trabalhamos apenas com links públicos.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Entrega Rápida
            </h3>
            <p className="text-gray-600">
              Início imediato e entrega em até 24 horas na maioria dos serviços.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
