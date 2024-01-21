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
    name: "Calender",
    url: "/calender",
    link: "/calender",
  },
  {
    name: "Esoterica",
    url: "/esoterica",
    link: "/esoterica",
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

  const checkSessionAndNavigate = (link) => {
    // If user is not logged in, redirect to the login page
    setShowMenu(false);
    if (session == null || session?.status === 'unauthenticated' || !session) {
      router.replace('/dashboard/login');
    } else {
      router.push(link);
    }
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
      <div className={`${styles.nav_items} ${styles.name_nav} ${styles.computer_nav}`}>
        <Link href="/" onClick={() => checkSessionAndNavigate("/")}>Tsion</Link>
      </div>

      <div className={styles.links + (showMenu ? ` ${styles.show}` : '')}>
        {links.map((link) => {
          return (
            <div className={`${styles.nav_items} ${styles.sideNav}`} key={link.name}>
              <h4 href={link.link} className={styles.link} onClick={() => checkSessionAndNavigate(link.link)}>
                {link.name}
              </h4>
            </div>
          );
        })}

        <div className={`${styles.nav_items} ${styles.sideNav}`} key={"SighOut"}>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
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
      <div className={styles.mobileNav}>
        <h4 className={styles.title} onClick={() => checkSessionAndNavigate("/")}>
          Tsion
        </h4>
        <Image
          className={styles.hamburgerIconContainer }
          onClick={() => setShowMenu(!showMenu)}
          src={"/hamburger-menu.png"}
          width={32}
          height={32}
          alt={"Hamburger Menu"}
        />
      </div>
    </nav>
  );
};

export default Navbar;
