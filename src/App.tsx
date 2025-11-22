import { useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ServiceSelector from './components/ServiceSelector';
import HowItWorks from './components/HowItWorks';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

function App() {
  const { user } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (user && window.location.hash === '#dashboard') {
    return (
      <>
        <Header />
        <Dashboard />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Hero />
      <ServiceSelector />
      <HowItWorks />
      <Footer />
    </>
  );
}

export default App;
