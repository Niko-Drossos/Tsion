"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./page.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/components/Context/UserContext";
import { setCookie } from 'cookies-next';
import Link from "next/link";
import Error from '@/components/Error/page'

const Login = () => {
  const { user, login } = useUser()
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordField = useRef(null)

  /* useEffect(() => {
    setError(params.get("error"));
    setSuccess(params.get("success"));
  }, [params]); */

  function togglePasswordVisibility() {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  }

  const handleSubmit = async (e) => {
    try {
      setLoading(true)

      e.preventDefault();
      const email = e.target[0].value;
      const password = e.target[1].value;
      const rememberMe = e.target[3].checked
      
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

      const response = await signIn.json()
      if (response.success) { 
        // Set the users login state
        const { username, email, _id: id } = response.data
        login({ username, email, id })

        const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24

        setCookie('tsion', response.token, { maxAge: maxAge, path: "/" })

        router.push("/dashboard");
      } else {
        setError(response.errorMessage)
      }
        
    } catch (error) {
      // TODO: make proper error message 
      console.log(error);
    } finally {
      setLoading(false)
    }
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
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          id="password"
          required
          className={styles.input}
          ref={passwordField}
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
        <div>
          <input
            type="checkbox"
            id="rememberMe"
            className={styles.showPassword}
            defaultChecked
          />
          <label>
            Remember Me
          </label>
        </div>
        <button className={styles.button} disabled={loading}>Login</button>
      </form>
      <span className={styles.or}>- OR -</span>
      <Link className={styles.link} href="/dashboard/register">
        Create new account
      </Link>
    </div>
  );
};

export default Login;