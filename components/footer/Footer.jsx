import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";

const Footer = () => {
  const date = new Date
  return (
    <div className={styles.container}>
      <div>{date.getFullYear()} Niko Drossos, Beth-Kavod LLC. All rights reserved.</div>
      <div className={styles.social}>
        <a href="https://facebook.com" target="_blank"><Image src="/1.png" width={15} height={15} className={styles.icon} alt="West-MEC Facebook Account" /></a>
        <a href="https://instagram.com" target="_blank"><Image src="/2.png" width={15} height={15} className={styles.icon} alt="West-MEC" /></a>
        <a href="https://twitter.com" target="_blank"><Image src="/3.png" width={15} height={15} className={styles.icon} alt="West-MEC" /></a>
        <a href="https://youtube.com" target="_blank"><Image src="/4.png" width={15} height={15} className={styles.icon} alt="West-MEC" /></a>
      </div>
    </div>
  );
};

export default Footer;
