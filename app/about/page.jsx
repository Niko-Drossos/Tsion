import React from "react";
import styles from "./page.module.css";
import Image from "next/image";
import Button from "@/components/Button/Button";
import MyPhoto from '../../public/me.jpg'

const About = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.background}>
          <div className={styles.text_background}>
            <h2>What is Barter Kingdom</h2>
            <p>
              Barter Kingdom has the goal of decentralizing trade by making bartering peer to peer easy and simple
            </p>
          </div>
          <div>
            <Image src={MyPhoto} alt="My Photo"  className={styles.picture} />
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
