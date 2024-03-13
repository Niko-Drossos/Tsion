"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/AuthProvider/UserContext";
import Image from "next/image";
import ImageUpload from "@/components/forms/ImageUpload";
import Carousel from "@/components/gallery/Carousel/page";

const Blog = () => {
  const { user } = useUser();
  const [images, setImages] = useState([])

  /* const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];
    console.log(`Image File: ${imageFile}`);
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "Blog_Images");

    fetch(`/api/events`, {
      method: "POST",
      body: formData,
    })
    .then((res) => res.json())
    .then((data) => {
      const url = data.secure_url;
      setImageUrl(url);
    })
    .catch((err) => console.error(err));
  }; */

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = e.target[0].value;
    const content = e.target[2].value;
    console.log("Blog post creation not yet available")
    return

    try {
      //! FIX SESSION NOT CONTAINING DATA, USE THE useUser HOOK
      await fetch("/api/posts/create", {
        method: "POST",
        body: JSON.stringify({
          user: {
            author: user.username,
            posterID: user.id,
            // avatar: 
          },
          title,
          images,
          content,
        }),
      });
      mutate();
      e.target.reset();
    //! DEV LOGS
    console.log({
      user: {
        author: session.data.user.name,
        posterID: session.data.user._id,
        // avatar: 
      },
      title,
      images,
      content,
    })
    } catch (err) {
      console.log(err);
    }
  };

  /* const handleDelete = async (id) => {
    try {
      await fetch(`/api/posts/delete/${id}`, {
        method: "POST",
      });
      mutate();
    } catch (err) {
      console.log(err);
    }
  }; */

  return (
    <div className={styles.form_container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Add New Post</h1>
        <input type="text" placeholder="Title" className={styles.input} />
        <div className={styles.input}>
          <ImageUpload params={{images, setImages}}/>
        </div>
        {images[0] && (
          <div style={{ maxWidth: 200 }}>
            <Carousel />
          </div>
        )}
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
