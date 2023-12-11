"use client";

import Link from "next/link";
import React from "react";
import styles from "./navbar.module.css";

/* const links = [
  {
    name: "About",
    url: "/about",
    link: "https://avaragecodeenjoyer.github.io/Real-portfolio-Website/AboutMe.html",
  },
  {
    name: "Portfolio",
    url: "/portfolio",
    link: "https://avaragecodeenjoyer.github.io/Real-portfolio-Website/Portfolio.html",
  },
  {
    name: "Home",
    url: "/home",
    link: "https://avaragecodeenjoyer.github.io/Real-portfolio-Website/index.html",
  },
  {
    name: "Dashboard",
    url: "/dashboard",
    link: "/dashboard",
  },
]; */

const links = [
  {
    name: "About",
    url: "/about",
    link: "/about"
  },
  {
    name: "Dashboard",
    url: "/dashboard",
    link: "/dashboard",
  }
]

const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <div className={`${styles.nav_items} ${styles.name_nav}`}>
        <Link href="/">
          Niko Drossos
        </Link>
      </div>
      <div className={styles.space} />
      {links.map(link => {
        return (
          <div className={`${styles.nav_items} ${styles.sideNav}`}>
            <Link
              href={link.link}
              className={styles.link}
            >
              {link.name}
            </Link>
          </div>
        );
      })}
    </nav>
  );
};

export default Navbar;
