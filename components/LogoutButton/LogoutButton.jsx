import { useRouter } from 'next/router';
import { useUser } from '@/components/AuthProvider/UserContext';

// Your component
const LogoutButton = () => {
  const { user, logout } = useUser();
  // Use the useRouter hook to access the router
  const router = useRouter();

  // Function to handle logout
  const handleLogout = async () => {
    // Sign out the user
    logout();

    // Redirect to the homepage or any other desired page
    router.push('/');
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
