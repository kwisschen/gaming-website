import React from "react";
import * as styles from "../styles/layout.module.css";

const Layout = ({ children }) => (
  <div className={styles.siteWrapper}>
    <header className={styles.header}>
      <div>
        <h1><a className={styles.siteTitle} href="/">RankedByGamers</a></h1>
      </div>
      <nav>
        <ul className={styles.navLinks}>
          <li className={styles.navLinkItem}><a href="/">Home</a></li>
          <li className={styles.navLinkItem}><a href="/about">About</a></li>
          <li className={styles.navLinkItem}><a href="/genres">Games</a></li>
        </ul>
      </nav>
    </header>
    <main className={styles.content}>{children}</main>
    <footer className={styles.siteFooter}>
      {new Date().getFullYear()} © Christopher Chen in CSCI E-114
    </footer>
  </div>
);

export default Layout;
