import { createContext, useContext, useState } from 'react';
import RentCars from '../Pages/rentCars/RentCars'; // קומפוננטה RentCars

const AppContext = createContext();

// פונקציה לגישה נוחה לסטייט
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [sharedValue, setSharedValue] = useState('');

  return (
    <AppContext.Provider value={{ sharedValue, setSharedValue }}>
      {children} {/* כל קומפוננטה שתהיה כאן תוכל לגשת לסטייט */}
    </AppContext.Provider>
  );
};
