"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import cloudinaryConfig from "@/config/cloudinary";

const Blog = () => {
  const [imageUrl, setImageUrl] = useState("");
  const session = useSession();
  const [user, setUser] = useState()
  //NEW WAY TO FETCH DATA
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, error, isLoading } = useSWR(
    `/api/user/${user}`,
    fetcher,
    {
      onSuccess: (fetchedData) => {
        setUser(fetchedData);
      },
    }
  );
  
  if (session.status === "loading") {
    return <p>Loading...</p>;
  }

  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];
    console.log(`Image File: ${imageFile}`);
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "Blog_Images");

    fetch(`https://api.cloudinary.com/v1_1/djez6nvh7/image/upload`, {
      method: "POST",
      body: formData,
    })
    .then((res) => res.json())
    .then((data) => {
      const url = data.secure_url;
      setImageUrl(url);
    })
    .catch((err) => console.error(err));
  };
  // This does not upload the photo to cloudinary
  /* const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Display the selected image
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    } else {
      // Clear the image if no file is selected
      setImageUrl('');
    }
  }; */

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = e.target[0].value;
    const content = e.target[2].value;

    try {
      await fetch("/api/posts/create", {
        method: "POST",
        body: JSON.stringify({
          user: {
            author: session.data.user.name,
            posterID: session.data.user._id,
            // avatar: 
          },
          title,
          imageUrl,
          content,
        }),
      });
      mutate();
      e.target.reset();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/posts/delete/${id}`, {
        method: "POST",
      });
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  if (session.status === "authenticated") {
    return (
      <div className={styles.form_container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h1>Add New Post</h1>
          <input type="text" placeholder="Title" className={styles.input} />
          <input
            type="file"
            placeholder="image"
            onChange={handleImageUpload}
            accept="image/*"
            className={styles.input}
          />
          {imageUrl && (
            <div style={{ maxWidth: 200 }}>
              <Image
                src={imageUrl}
                alt={"Just me"}
                width={200}
                height={200}
              />
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
  }
};

export default Blog;
