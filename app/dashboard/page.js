"use client"
// Import necessary modules
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useUser } from '@/components/AuthProvider/UserContext'; 

// Your component
const Dashboard = () => {
  const { user, logout } = useUser();
  const handleLogout = () => {
    // Sign out the user
    logout();
  };

  return (
    <div className={styles.container}>
      { 
        user.username && 
        <div>
          <h1>{user.username}</h1>
        </div>
      }
      <button onClick={handleLogout} className={styles.logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
