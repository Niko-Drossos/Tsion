"use client"
import { useState, useEffect, useRef } from 'react'
import styles from './page.module.css'

export default function PsalmModal({ psalm }) {
  const [showModal, setShowModal] = useState(true)
  const psalmRef = useRef(null)
  
  useEffect(() => {
    if (showModal) {
      psalmRef.current.showModal()
      console.log(psalmRef.current)
    } else {
      psalmRef.current.close()
    }
    console.log(psalmRef.current)
  }, [psalm, showModal])

  return (
    <dialog
      id="psalm-modal"
      className={styles.dialog}
      ref={psalmRef}
    >
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, consequatur necessitatibus est doloribus animi earum illo at itaque consectetur corrupti cum beatae commodi nostrum et magnam fugit officia error. Excepturi!
      <form method="dialog">
        <button onClick={() => setShowModal(prev => !prev)}>X</button>
      </form>
    </dialog>
  )
}