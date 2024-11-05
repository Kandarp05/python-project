import React from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {

  const location = useLocation();

  const hideNavbarOnPaths = ['/login'];
  const isNavbarVisible = !hideNavbarOnPaths.includes(location.pathname);

  return (
    <div>
      <div className="overlay" />
      {isNavbarVisible ? <Navbar /> : null}
      <main style={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

const styles = {
  mainContent: {
    padding: '20px',
    width: '100%',
  }
};

export default Layout;
