import React, { useState } from 'react';
import App1 from './App1';
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
    localStorage.removeItem('accessToken');
        
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
      <App1 onLogout={handleLogout}/>
    )}
  </div>
  )
}

export default App;
