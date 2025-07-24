"use client";
import Link from "next/link";
import styles from "./authLinks.module.css";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { FaUserCircle } from "react-icons/fa";

const AuthLinks = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { status } = useSession();

  return (
    <>
      {status === "unauthenticated" ? (
        <Link href="/login" className={styles.link}>
          Đăng nhập
        </Link>
      ) : (
        <div className={styles.userMenu}>
          <FaUserCircle
            className={styles.userIcon}
            onClick={() => setMenuOpen(!menuOpen)}
          />
          {menuOpen && (
            <div className={styles.dropdown}>
              <Link href="/write" className={styles.dropdownItem}>
                Viết bài
              </Link>
              <span className={styles.dropdownItem} onClick={signOut}>
                Đăng xuất
              </span>
            </div>
          )}
        </div>
      )}

      {/* Burger menu cho mobile */}
      <div className={styles.burger} onClick={() => setMobileOpen(!mobileOpen)}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>

      {mobileOpen && (
        <div className={styles.responsiveMenu}>
          <Link href="/">Trang chủ</Link>
          <Link href="/about">Giới thiệu</Link>
          <Link href="/contact">Liên hệ</Link>
          {status === "unauthenticated" ? (
            <Link href="/login">Đăng nhập</Link>
          ) : (
            <>
              <Link href="/write">Viết bài</Link>
              <span onClick={signOut}>Đăng xuất</span>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AuthLinks;
