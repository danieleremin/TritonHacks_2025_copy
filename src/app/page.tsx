import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header>
        <h3>FireSight</h3>
      </header>
      <main className={styles.main}>
        <Link href="/main" className={styles.mainLink}>Actual page</Link>
        <iframe width="500" height="400" src="about:blank" title="Map"></iframe>
      </main>
      {/* <footer>
        <p></p>
      </footer> */}
    </div>
  );
}
