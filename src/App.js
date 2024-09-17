import React, { useState } from 'react';
import App1 from './App1';
import { AccessDeniedProvider } from './components/AccessDeniedProvider';
import LoginPage from './pages/LoginPage';
import "./styles/basic.css";
// import ReadOperation from './pages/Operations/ReadOperation'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  const handleLogout = () => {
    // Clear authentication state and perform any additional logout actions
    setIsAuthenticated(false);
    // Optionally clear tokens, local storage, or perform any cleanup
    // localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('auth');
        
    // Redirect to the root URL
    window.location.href = '/';

  };
  // if (!isAuthenticated) {
  //   return <LoginPage onLogin={setIsAuthenticated} />;
  // }
  // const navigate = useNavigate();

  return (
      <div>
          {!isAuthenticated ? (
            <LoginPage onLogin={handleLogin} />
            
          ) : (
    <AccessDeniedProvider>
            <App1 onLogout={handleLogout}/>

    </AccessDeniedProvider>

          )}
        </div>
  
   
  )
}

export default App;
