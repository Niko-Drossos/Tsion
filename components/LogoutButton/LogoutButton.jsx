import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

// Your component
const LogoutButton = () => {
  // Use the useSession hook to access the session data
  const { data: session } = useSession();
  
  // Use the useRouter hook to access the router
  const router = useRouter();

  // Function to handle logout
  const handleLogout = async () => {
    // Sign out the user
    await signOut();

    // Redirect to the homepage or any other desired page
    router.push('/');
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
