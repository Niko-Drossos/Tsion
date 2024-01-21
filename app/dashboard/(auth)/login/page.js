"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Error from '@/components/Error/page'

const Login = ({ url }) => {
  const session = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError(params.get("error"));
    setSuccess(params.get("success"));
  }, [params]);

  if (session.status === "loading") {
    return <h1>Loading...</h1>;
  }

  function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
  
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }  

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    setLoading(true)
    signIn("credentials", {
      email,
      password,
    });
    setLoading(false)
    if (session.status === "authenticated") {
      router.push("/")
    } else {
      setError("Wrong username or password.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{success ? success : "Welcome Back"}</h1>
      <h2 className={styles.subtitle}>Please sign in to use application.</h2>
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