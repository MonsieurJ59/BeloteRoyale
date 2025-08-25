import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isCollapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed: controlledCollapsed }) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  
  const toggleSidebar = () => {
    if (controlledCollapsed === undefined) {
      setInternalCollapsed(!internalCollapsed);
    }
  };


  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { 
      path: '/', 
      label: 'Accueil', 
      icon: 'M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9ZM9 22V12H15V22' 
    },
    { 
      path: '/tournaments', 
      label: 'Tournois', 
      icon: 'M6 9L12 15L18 9M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z' 
    },
    { 
      path: '/teams', 
      label: 'Équipes', 
      icon: 'M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11ZM23 21V19C23 18.1645 22.7155 17.3541 22.2094 16.6977C21.7033 16.0414 20.9999 15.5755 20.2 15.3727M16 3.13C16.8003 3.33273 17.5037 3.79863 18.0098 4.45496C18.5159 5.11129 18.8004 5.92167 18.8004 6.75739C18.8004 7.59312 18.5159 8.40349 18.0098 9.05982C17.5037 9.71615 16.8003 10.1821 16 10.3848' 
    },
    { 
      path: '/matches', 
      label: 'Matchs', 
      icon: 'M2 5C2 3.89543 2.89543 3 4 3H20C21.1046 3 22 3.89543 22 5V15C22 16.1046 21.1046 17 20 17H4C2.89543 17 2 16.1046 2 15V5ZM8 21H16M12 17V21' 
    },
  ];

  return (
    <>
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            </svg>
            Belote Royale
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d={isCollapsed ? "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" : "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}/>
            </svg>
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path} className="sidebar-nav-item">
                <Link 
                  to={item.path} 
                  className={`sidebar-nav-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  <svg className="sidebar-nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                  <span className="sidebar-nav-text">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      <div className={`sidebar-overlay ${isMobileOpen ? 'visible' : ''}`} onClick={closeMobileSidebar} />
    </>
  );
};

export default Sidebar;
