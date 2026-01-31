import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import EmergencyCallBanner from './EmergencyCallBanner';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showEmergencyBanner?: boolean;
}

const Layout = ({ 
  children, 
  showHeader = true, 
  showFooter = true,
  showEmergencyBanner = false,
}: LayoutProps) => {
  const location = useLocation();
  
  // Determine if we're in citizen mode paths
  const citizenPaths = ['/citizen', '/emergency', '/cpr', '/summary', '/map'];
  const isInCitizenMode = citizenPaths.some(path => location.pathname.startsWith(path));
  
  // Show emergency banner in citizen mode by default
  const shouldShowBanner = showEmergencyBanner || isInCitizenMode;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Gradient radial overlay */}
      <div className="fixed inset-0 gradient-radial pointer-events-none" />
      
      {showHeader && <Header />}
      
      <main className="flex-1 relative z-10 page-enter">
        {children}
      </main>
      
      {showFooter && <Footer />}
      
      {shouldShowBanner && <EmergencyCallBanner />}
    </div>
  );
};

export default Layout;
