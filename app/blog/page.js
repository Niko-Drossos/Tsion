"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Button from '@/components/Button/Button'
import { useUser } from '@/components/Context/UserContext'
import TestPhoto from '@/public/1.png'

const Blog = () => {
  const [pageSize, setPageSize] = useState(5)
  const [pageNumber, setPageNumber] = useState(1)
  const [maxPages, setMaxPages] = useState(1)
  const { user } = useUser()

  if (pageNumber < 1) setPageNumber(1)
  else if (pageNumber > maxPages) setPageNumber(pageNumber - 1)

  //NEW WAY TO FETCH DATA
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, mutate, error, isLoading } = useSWR(
    `/api/posts/get-post?size=${pageSize}&page=${pageNumber}`,
    fetcher,
    {
      onSuccess: (fetchedData) => {
        setMaxPages(fetchedData.totalPages);
      },
    }
  );
  
  console.log(data)
  
  return (
    <div className={styles.container}>
      <div className={styles.posts}>
      {isLoading
        ? "Loading..."
        : data.data?.map((post) => (
            <div className={styles.post} key={post._id}>
              {/* <div className={styles.imgContainer}>
                {post.img ? (
                  <Image src={post.img} alt="" width={200} height={100} />
                ) : (
                  ""
                )}
              </div> */}
              <div className={styles.head}>
                <Image src={TestPhoto} alt="Profile photo" className={styles.profile_photo} />
                <div className={styles.postTitle}>
                  <h2>{post.title}</h2>
                  <h4 className={styles.username}>
                    <Link href={`/profile/${post?.user?.posterID}`}>@{post?.user?.author}</Link>
                  </h4>
                  <h4 className={styles.date_posted}>posted: {post.createdAt.toLocaleString()}</h4>
                </div>
              </div>

              <div className={styles.post_body}>
                {post.content}
              </div>

              <div className={styles.icons}>
                <button>like</button>
                <button>comment</button>
                <button>share</button>
              </div>
            </div>
          ))}
      </div>
      <div className={styles.buttons}>
        <div className={styles.pageButtons}>
          <button onClick={() => setPageNumber(pageNumber - 1)} className={styles.button}>-</button>
          <h4>Page: {pageNumber}</h4>
          <button onClick={() => setPageNumber(pageNumber + 1)} className={styles.button}>+</button>  
        </div>
        <div>
          <Link href={`/blog/create-post`} className={styles.create_post}>Create post</Link>
        </div>
      </div>
    </div>
  );
};
export default Blog;
