"use client"
// Import necessary modules
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import styles from './page.module.css';

// Your component
const Dashboard = () => {
  const handleLogout = async () => {
    // Sign out the user
    await signOut();
  };

  return (
    <div className={styles.container}>
      <button onClick={handleLogout} className={styles.logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
