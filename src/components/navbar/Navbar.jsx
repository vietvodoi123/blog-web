import React from "react";
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";
import ThemeToggle from "../themeToggle/ThemeToggle";

const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.social}>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="/facebook.png" alt="facebook" width={20} height={20} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/instagram.png"
              alt="instagram"
              width={20}
              height={20}
            />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="/tiktok.png" alt="tiktok" width={20} height={20} />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="/youtube.png" alt="youtube" width={20} height={20} />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <Link href="/" className={styles.logo}>
          BaoTin24h
        </Link>
      </div>

      <div className={styles.right}>
        <nav className={styles.links}>
          <ThemeToggle />
          <Link href="/" className={styles.link}>
            Trang chủ
          </Link>
          <Link href="/contact" className={styles.link}>
            Liên hệ
          </Link>
          <Link href="/about" className={styles.link}>
            Giới thiệu
          </Link>
        </nav>
        <AuthLinks />
      </div>
    </header>
  );
};

export default Navbar;
