import { ThemeProvider } from '@/components/Context/ThemeContext';
import { UserProvider } from '@/components/Context/UserContext';

export default function AppContext({ children }) {
  return (
    <ThemeProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </ThemeProvider>
  );
};
