"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/Context/UserContext";

const Blog = () => {
  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = e.target[0].value;
    const content = e.target[1].value;

    if (!title || !content) return

    try {
      await fetch("/api/posts/create", {
        method: "POST",
        body: JSON.stringify({
          user: {
            author: user.username,
            posterID: user.id,
          },
          title,
          content,
        }),
      });
      e.target.reset();
      router.push("/blog");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.form_container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Add New Post</h1>
        <input type="text" placeholder="Title" className={styles.input} />
        <textarea
          placeholder="Content"
          className={styles.textArea}
          cols="30"
          rows="10"
        ></textarea>
        <button type="submit" className={styles.button}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Blog;
