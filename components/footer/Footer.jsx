import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";

const Footer = () => {
  const date = new Date
  return (
    <div className={styles.container}>
      <div>{date.getFullYear()} Beth-Kavod. All rights reserved.</div>
      <div className={styles.social}>
        <a href="https://www.facebook.com/profile.php?id=100067468345137" target="_blank"><Image src="/1.png" width={30} height={30} className={styles.icon} alt="West-MEC Facebook Account" /></a>
        <a href="https://instagram.com" target="_blank"><Image src="/2.png" width={30} height={30} className={styles.icon} alt="West-MEC" /></a>
        <a href="https://twitter.com" target="_blank"><Image src="/3.png" width={30} height={30} className={styles.icon} alt="West-MEC" /></a>
        <a href="https://www.youtube.com/@bethkavod4527/videos" target="_blank"><Image src="/4.png" width={30} height={30} className={styles.icon} alt="West-MEC" /></a>
      </div>
    </div>
  );
};

export default Footer;
