import React from 'react';
import Navbar from './Navbar';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
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
