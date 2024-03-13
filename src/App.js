import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
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
    console.log(cookie);
    if (cookie) {
      const sessionIdValue = cookie.split('=')[1];
      console.log("chamou");
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

  // if(!isLoggedIn){
  //   return(
  //     <Routes>
  //       <Route path="*" element={<Navigate to="/login" replace />} />
  //       <Route path="/login" element={<Login />} />
  //     </Routes>
  //   )
  // }

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
            <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
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
