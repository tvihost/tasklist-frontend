import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Tasks from "./scenes/tasks";
import Form from "./scenes/tasks/create";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import axios from 'axios';
import Login from "./scenes/login";
import './index.css';

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [sessionId, setSessionId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('sessionId='));
    if (cookie) {
      const sessionIdValue = cookie.split('=')[1];
      setSessionId(sessionIdValue);
    }

    checkSession();
  }, []);

  async function checkSession(){
    await axios.get('http://localhost:3000/auth/checkSession', { withCredentials: true })
    .then(response => {
      if(response.status === 200){
        setIsLoggedIn(response.data.isLoggedIn);
        setIsLoading(false);
      }
    })
    .catch(error => {
      console.log(error);
      setIsLoggedIn(false);
      setIsLoading(false);
    });
  }

  return !isLoggedIn && !isLoading ? (
    <Routes>
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  ) : !isLoading ? (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
            <Route path="*" element={<Navigate to="/tasks" replace />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/create" element={<Form />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  ) : (
    <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
    </div>
  );
}

export default App;
