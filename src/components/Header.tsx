import { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">SMM Panel</h1>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">
                Serviços
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
                Como Funciona
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                Preços
              </a>
              {user ? (
                <div className="flex items-center space-x-4">
                  <a
                    href="#dashboard"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <User size={20} />
                    <span>Painel</span>
                  </a>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={20} />
                    <span>Sair</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Entrar
                </button>
              )}
            </nav>

            <button
              className="md:hidden text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-4">
              <a href="#services" className="block text-gray-600 hover:text-blue-600">
                Serviços
              </a>
              <a href="#how-it-works" className="block text-gray-600 hover:text-blue-600">
                Como Funciona
              </a>
              <a href="#pricing" className="block text-gray-600 hover:text-blue-600">
                Preços
              </a>
              {user ? (
                <>
                  <a href="#dashboard" className="block text-gray-600 hover:text-blue-600">
                    Painel
                  </a>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left text-gray-600 hover:text-red-600"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="block w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Entrar
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
