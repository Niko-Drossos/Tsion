// "use client"
import { ThemeProvider } from '@/components/context/ThemeContext';
import { UserProvider } from '@/components/context/UserContext';

export const AppProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </ThemeProvider>
  );
};
