// Import necessary modules and styles
"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define the Register component
const Register = () => {
  // State to manage error messages
  const [error, setError] = useState(null);

  // Next.js router
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Extract user input from the form
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    try {
      // Send a POST request to the "/api/auth/register" endpoint
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Convert user input to JSON and include it in the request body
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      // Check if the registration was successful (status code 201)
      res.status === 201 &&
        router.push("/dashboard/login?success=Account has been created");
    } catch (err) {
      // Handle errors and log them to the console
      setError(err);
      console.log(err);
    }
  };

  // Render the Register component
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create an Account</h1>
      <h2 className={styles.subtitle}>Please sign up to see the dashboard.</h2>
      {/* Registration form */}
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
          placeholder="Password"
          required
          className={styles.input}
        />
        <button className={styles.button}>Register</button>
        {/* Display error message if there is an error */}
        {error && "Something went wrong!"}
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
