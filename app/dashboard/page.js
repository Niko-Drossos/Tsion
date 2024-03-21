"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useUser } from '@/components/Context/UserContext'; 
import DarkModeToggle from '@/components/DarkModeToggle/DarkModeToggle'

// Your component
const Dashboard = () => {
  const { user, logout } = useUser();
  const router = useRouter()
  const handleLogout = () => {
    // Sign out the user
    logout();
    router.push('/dashboard/login')
  };

  useEffect(() => {console.log(user)},[user])

  return (
    <div className={styles.container}>
      {/* Toggle Dark mode: <DarkModeToggle /> */}
      { 
        user?.username && 
        <div>
          <h1>{user.username}</h1>
        </div>
      }
      <button onClick={handleLogout} className={styles.logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
