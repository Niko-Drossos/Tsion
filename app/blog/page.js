"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import Link from "next/link";
import { useUser } from '@/components/Context/UserContext'

const Blog = () => {
  const [pageSize, setPageSize] = useState(5)
  const [pageNumber, setPageNumber] = useState(1)
  const [maxPages, setMaxPages] = useState(1)

  if (pageNumber < 1) setPageNumber(1)
  else if (pageNumber > maxPages) setPageNumber(pageNumber - 1)

  //NEW WAY TO FETCH DATA
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, isLoading } = useSWR(
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

      <div className={styles.posts}>
      {isLoading
        ? "Loading..."
        : data.data?.map((post) => (
            <div className={styles.post} key={post._id}>
              <div className={styles.head}>
                <div className={styles.postTitle}>
                  <h2>{post.title}</h2>
                  <h4 className={styles.username}>
                    <Link href={`/profile/${post?.user?.posterID}`}>@{post?.user?.author}</Link>
                  </h4>
                  <h4 className={styles.date_posted}>{new Date(post.createdAt).toLocaleString()}</h4>
                </div>
              </div>

              <div className={styles.post_body}>
                {post.content}
              </div>

              {/* Include like, comment, share buttons once functionality added */}
              {/* <div className={styles.icons}>
                <button>like</button>
                <button>comment</button>
                <button>share</button>
              </div> */}
            </div>
          ))}
      </div>
    </div>
  );
};
export default Blog;
