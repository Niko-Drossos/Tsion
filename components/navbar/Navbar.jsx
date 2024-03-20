"use client";
import Link from "next/link";
import Image from "next/image"
import React, { useState, useEffect } from "react";
// import { useUser } from "@/components/AuthProvider/UserContext";
import styles from "./navbar.module.css";

const links = [
  {
    name: "Dashboard",
    url: "/dashboard",
    link: "/dashboard",
  },
  {
    name: "Timers",
    url: "/timers",
    link: "/timers",
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
    name: "Channels",
    url: "/channels",
    link: "/channels",
  },
  {
    name: "Tsion",
    url: "/tsion",
    link: "/tsion",
  },
  /* {
    name: "Channels",
    url: "/channels",
    link: "/channels",
  },
  {
    name: "Tsion",
    url: "/tsion",
    link: "/tsion",
  } */
]

const Navbar = () => {
  // const { user } = useUser();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={`${styles.nav_items} ${styles.name_nav} ${styles.computer_nav}`}>
        <Link href="/">Tsion</Link>
      </div>
      <div className={styles.hamburgerNav}>
        <h4 className={styles.title}>
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

      <div className={styles.links + (showMenu ? ` ${styles.show}` : '')}>
        {links.map((link, index) => {
          // For regular links, group them into pairs
          if (index % 2 === 0) {
            const nextLink = links[index + 1];
            return (
              <div className={`${styles.nav_items} ${styles.sideNav}`} key={link.name}>
                <a href={link.link} className={styles.link}>
                    {link.name}
                  </a>
                  {nextLink && (
                    <a href={nextLink.link} className={styles.link}>
                      {nextLink.name}
                    </a>
                  )}
              </div>
              );
            }

            // Skip links that are already handled in pairs
            return null;
          })}
        </div>
    </nav>
  );
};

export default Navbar;
