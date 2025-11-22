import { MousePointerClick, ShoppingCart, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Como Funciona
          </h2>
          <p className="text-lg text-gray-600">
            Simples, rápido e eficiente em apenas 3 passos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <MousePointerClick className="text-blue-600" size={32} />
            </div>
            <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Escolha o Serviço
            </h3>
            <p className="text-gray-600">
              Selecione a plataforma e o tipo de serviço que deseja: seguidores, curtidas, visualizações, etc.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="text-green-600" size={32} />
            </div>
            <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Faça o Pedido
            </h3>
            <p className="text-gray-600">
              Informe o link do seu post ou perfil e a quantidade desejada. Não pedimos senha!
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-purple-600" size={32} />
            </div>
            <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Receba os Resultados
            </h3>
            <p className="text-gray-600">
              Acompanhe seu pedido em tempo real e veja seu perfil crescer rapidamente.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="#services"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            COMEÇAR AGORA
          </a>
        </div>
      </div>
    </section>
  );
}
