"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Button from '@/components/Button/Button'

import TESTPHOTO from '@/public/1.png'

import Heart from '@/public/heart.png'
import Comment from '@/public/comment.png'
import Share from '@/public/share.png'

const Blog = () => {
  const [pageSize, setPageSize] = useState(5)
  const [pageNumber, setPageNumber] = useState(1)
  const [maxPages, setMaxPages] = useState(1)
  const session = useSession();

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

  if (session.status === "loading") {
    return <p>Loading posts...</p>;
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.posts}>
      {isLoading
        ? "loading"
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
                <Image src={TESTPHOTO} alt="Profile photo" className={styles.profile_photo} />
                <div className={styles.postTitle}>
                  <h2>{post.title}</h2>
                  <h4 className={styles.username}>
                    <Link href={`/profile/${post.posterID}`}>@{post.author}</Link>
                  </h4>
                  <h4 className={styles.date_posted}>posted: {post.createdAt.toLocaleString()}</h4>
                </div>
              </div>

              <div className={styles.post_body}>
                {post.content}
              </div>

              <div className={styles.iconContainer}>
                <button><Image src={Heart} alt={"Like"}  className={styles.icons}/></button>
                <button><Image src={Comment} alt={"Comment"}  className={styles.icons}/></button>
                <button><Image src={Share} alt={"Share"}  className={styles.icons}/></button>
              </div>
            </div>
          ))}
      </div>
      <div>
        <div>
          <Button text={"Create post"} url={`/blog/create-post`} className={styles.button} />
        </div>
        <button onClick={() => setPageNumber(pageNumber - 1)} className={styles.button}>-</button>
        <h4>PageNumber: {pageNumber}</h4>
        <button onClick={() => setPageNumber(pageNumber + 1)} className={styles.button}>+</button>
      </div>
    </div>
  );
};
export default Blog;
