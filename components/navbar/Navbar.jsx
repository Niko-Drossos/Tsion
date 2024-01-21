"use client";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image"
import React, { useState, useEffect } from "react";
import styles from "./navbar.module.css";

const links = [
  {
    name: "Dashboard",
    url: "/dashboard",
    link: "/dashboard",
  },
  {
    name: "About",
    url: "/about",
    link: "/about"
  },
  {
    name: "Blog",
    url: "/blog",
    link: "/blog",
  },
  {
    name: "Tsion",
    url: "/tsion",
    link: "/tsion",
  }
]

const Navbar = () => {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      // Automatically redirect to the login screen
      router.replace('/dashboard/login')
      return
    }
  }, [session, router])
    
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleSignOut = async () => {
    try {
      await signOut()
      console.log("Signed out")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <nav className={styles.nav}>
      <div className={`${styles.nav_items} ${styles.name_nav}`}>
        <Link href="/">Tsion</Link>
      </div>

      <div className={styles.links + (showMenu ? ` ${styles.show}` : '')}>
        {links.map((link) => {
          return (
            <div className={`${styles.nav_items} ${styles.sideNav}`} key={link.name}>
              <Link href={link.link} className={styles.link} onClick={toggleMenu}>
                {link.name}
              </Link>
            </div>
          );
        })}

        {/* <div className={`${styles.nav_items} ${styles.sideNav}`} key={"SighOut"}>
          <button onClick={handleSignOut}>Sign Out</button>
        </div> */}
      </div>

      {/* <div className={`${styles.nav_items} ${styles.name_nav}`}>
        {session ? (
          <div className={styles.profileSection}>
            <Image 
              href={`/profile/${session.user.id}`}
              src={session.user.profilePhoto ?? defaultProfile }
              className={styles.profilePhoto}
              width={50}  
            />
          </div>
        ) : (
          <Link href="/dashboard">
            Login
          </Link>
        )}
      </div> */}
      <Image 
        className={styles.hamburgerIconContainer }
        onClick={toggleMenu}
        src={"/hamburger-menu.png"}
        width={32}
        height={32}
        alt={"Hamburger Menu"}
      />
    </nav>
  );
};

export default Navbar;
