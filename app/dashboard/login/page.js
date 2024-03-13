"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/components/AuthProvider/UserContext";
import Link from "next/link";
import Error from '@/components/Error/page'

const Login = ({ url }) => {
  const { user, login } = useUser()
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError(params.get("error"));
    setSuccess(params.get("success"));
  }, [params]);

  function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
  
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    setLoading(true)
    const signIn = await fetch(`/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    console.log(await signIn.json())
    /* login({
      email,
      password,
    }); */
    /* if (session.status !== "authenticated" && session.status !== "loading") {
      setError("Wrong username or password.");
    } else if (session.status === "authenticated") {
      router.push("/")
    } */
    setLoading(false)
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{success ? success : "Welcome Back"}</h1>
      <h2 className={styles.subtitle}>Please sign in to use Tsion.</h2>
      {/* Conditional loading and error components */}
      { loading ? <h1>Loading...</h1> : "" }
      {error && <Error error={error} />}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Email"
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          required
          className={styles.input}
        />
        <div>
          <input
            type="checkbox"
            id="showPassword"
            className={styles.showPassword}
            onClick={togglePasswordVisibility}
          />
          <label>
            Show Password
          </label>
        </div>
        <button className={styles.button}>Login</button>
      </form>
      <span className={styles.or}>- OR -</span>
      <Link className={styles.link} href="/dashboard/register">
        Create new account
      </Link>
    </div>
  );
};

export default Login;