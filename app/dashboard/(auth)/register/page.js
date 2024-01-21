// Import necessary modules and styles
"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Error from "@/components/Error/page"
import { useRouter } from "next/navigation";

// Define the Register component
const Register = () => {
  // State to manage error messages
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Next.js router
  const router = useRouter();

  function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
  
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }  

  const handleVerification = async (email) => {
    setLoading(true)
    let result = await fetch(`/api/user/verify/${email}`)
    let response = await result.json()

    console.log(response)
    return response
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Extract user input from the form
    const username = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const confirmPassword = e.target[3].value;

    try {
      setError(false)

      // Check if email is allow to make account
      const verify = await handleVerification(email)
      if (verify.success == false) {
        setLoading(false)
        setError(verify.errorMessage)
        return false
      }

      if (password != confirmPassword) {
        console.log("no")
        setError("Passwords do not match")
        return false
      }
      // Send a POST request to the "/api/auth/register" endpoint
      setLoading(true)
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Convert user input to JSON and include it in the request body
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      // Check if the registration was successful (status code 201)
      if (res.status === 201) { router.push("/dashboard/login?success=Account has been created") }
      setLoading(false)
    } catch (err) {
      // Handle errors and log them to the console
      setLoading(false)
      setError(err.message);
    }
  };

  // Render the Register component
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create an Account</h1>
      <h2 className={styles.subtitle}>Please sign up to see the dashboard.</h2>
      {/* Registration form */}
      { loading ? <h1>Loading...</h1> : "" }
      {/* Display error message if there is an error */}
      { error && <Error error={error} /> }
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Username"
          required
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Email"
          required
          className={styles.input}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Confirm Password"
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
        <button className={styles.button}>Register</button>
      </form>
      <span className={styles.or}>- OR -</span>
      {/* Link to login page */}
      <Link className={styles.link} href="/dashboard/login">
        Login with an existing account
      </Link>
    </div>
  );
};

// Export the Register component as the default export
export default Register;
