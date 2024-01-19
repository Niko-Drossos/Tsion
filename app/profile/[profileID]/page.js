"use client"
import Image from 'next/image';
import styles from './page.module.css';
import { useState, useEffect } from 'react';

export default function Home(request) {
  const profileID = request.params.profileID;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/user/${profileID}`);
        const data = await response.json();
        setUser(data.user);
        console.log(`Data: ${data}`); // Log the updated value of data
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  })

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <h1 className={styles.title}>
          Profile of, {user ? user.username : 'username not found'}
        </h1>
        {/* <p className={styles.desc}>
          
        </p> */}
      </div>
      <div className={styles.item}></div>
    </div>
  );
}
