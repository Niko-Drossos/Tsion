"use client"
// Import necessary modules
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import styles from './page.module.css';

// Your component
const Dashboard = () => {
  // Use the useSession hook to access the session data
  const session = useSession();

  // Use the useRouter hook to access the router
  const router = useRouter();

  // Redirect to the login page if the user is unauthenticated
  if (session.status === 'unauthenticated') {
    router?.push('/dashboard/login');
  }

  const handleLogout = async () => {
    // Sign out the user
    await signOut();

    // Redirect to the homepage or any other desired page
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <button onClick={handleLogout} className={styles.logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
