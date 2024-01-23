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
    name: "Timer",
    url: "/timer",
    link: "/timer",
  },
  {
    name: "About",
    url: "/about",
    link: "/about"
  },
  {
    name: "Calender",
    url: "/calender",
    link: "/calender",
  },
  {
    name: "Blog",
    url: "/blog",
    link: "/blog",
  },
  {
    name: "Esoterica",
    url: "/esoterica",
    link: "/esoterica",
  },
  {
    // Placeholder for new page
    name: "",
    url: "/",
    link: "/",
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

  /* const handleSignOut = async () => {
    try {
      await signOut()
      console.log("Signed out")
    } catch (err) {
      console.error(err)
    }
  } */

  return (
    <nav className={styles.nav}>
      <div className={`${styles.nav_items} ${styles.name_nav} ${styles.computer_nav}`}>
        <Link href="/" onClick={() => checkSessionAndNavigate("/")}>Tsion</Link>
      </div>
      <div className={styles.links + (showMenu ? ` ${styles.show}` : '')}>
        {links.map((link, index) => {
          // Check if it's the "Sign Out" button
          /* if (link.name === "Sign Out") {
            return (
              <div className={`${styles.nav_items} ${styles.sideNav}`} key={link.name}>
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            );
          } */

          // For regular links, group them into pairs
          if (index % 2 === 0) {
            const nextLink = links[index + 1];
            return (
              <div className={`${styles.nav_items} ${styles.sideNav}`} key={link.name}>
                <h4 href={link.link} className={styles.link} onClick={() => checkSessionAndNavigate(link.link)}>
                    {link.name}
                  </h4>
                  {nextLink && (
                    <h4 href={nextLink.link} className={styles.link} onClick={() => checkSessionAndNavigate(nextLink.link)}>
                      {nextLink.name}
                    </h4>
                  )}
              </div>
              );
            }

            // Skip links that are already handled in pairs
            return null;
          })}
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
