// App.jsx
import React from "react";
import { ThemeProvider } from './context/ThemeContext';

import { AuthProvider, useAuth } from "./store/authProvider";
import AppRoutes from "./AppRoutes";


function App() {

 
  return (
    <ThemeProvider>
      <AuthProvider>
      <AppRoutes/>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;