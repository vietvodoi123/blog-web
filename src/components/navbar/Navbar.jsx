import React from "react";
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";
import ThemeToggle from "../themeToggle/ThemeToggle";
import { FaBrain } from "react-icons/fa";

const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.social}>
          <Link href="#" target="_blank" rel="noopener noreferrer">
            <Image src="/facebook.png" alt="facebook" width={20} height={20} />
          </Link>
          <Link href="#" target="_blank" rel="noopener noreferrer">
            <Image
              src="/instagram.png"
              alt="instagram"
              width={20}
              height={20}
            />
          </Link>
          <Link href="#" target="_blank" rel="noopener noreferrer">
            <Image src="/tiktok.png" alt="tiktok" width={20} height={20} />
          </Link>
          <Link href="#" target="_blank" rel="noopener noreferrer">
            <Image src="/youtube.png" alt="youtube" width={20} height={20} />
          </Link>
        </div>
      </div>

      <div className={styles.center}>
        <Link href="/" className={styles.logo}>
          <FaBrain className={styles.iconbrain} />
          ThinkNest
        </Link>
      </div>

      <div className={styles.right}>
        <nav className={styles.links}>
          <ThemeToggle />
          <Link href="/" className={styles.link}>
            Trang chủ
          </Link>
          <Link href="#" className={styles.link}>
            Liên hệ
          </Link>
          <Link href="#" className={styles.link}>
            Giới thiệu
          </Link>
        </nav>
        <AuthLinks />
      </div>
    </header>
  );
};

export default Navbar;
