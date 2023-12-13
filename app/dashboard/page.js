"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import cloudinaryConfig from "@/config/cloudinary";

const Dashboard = () => {
  const router = useRouter();
  const session = useSession()
  if (session.status === "unauthenticated") {
    router?.push("/dashboard/login");
  }
  return (
    <div className={styles.container}>Dashboard</div>
  )
} 

export default Dashboard