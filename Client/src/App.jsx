import React from "react";
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from "./store/authProvider";
import AppRoutes from "./AppRoutes";
import { AppProvider } from "./components/global";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider> {/* עטיפה בקונטקסט של AppContext */}
          <AppRoutes /> {/* כל קומפוננטה שפה תהיה יכולה לגשת לסטייט */}
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
