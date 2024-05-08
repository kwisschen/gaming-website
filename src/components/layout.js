// src/components/layout.js
import React from "react";
import * as styles from "../styles/layout.module.css";
import SearchBar from "./search";

const Layout = ({ children }) => (
  <div className={styles.siteWrapper}>
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1><a className={styles.siteTitle} href="/">RankedByGamers</a></h1>
        <nav>
          <ul className={styles.navLinks}>
            <li className={styles.navLinkItem}><a href="/">Home</a></li>
            <li className={styles.navLinkItem}><a href="/about">About</a></li>
            <li className={styles.navLinkItem}><a href="/genres">Genres</a></li>
          </ul>
        </nav>
      </div>
      <SearchBar />
    </header>
    <main className={styles.content}>{children}</main>
    <footer className={styles.siteFooter}>
      Copyright © {new Date().getFullYear()} Christopher Chen
    </footer>
  </div>
);

export default Layout;
