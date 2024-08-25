'use client'
import { useRouter } from "next/navigation";
import styles from "./page.module.css"
const NotFound = ()=> {
    const router = useRouter();
    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.h1}>Server Error</h1>
            </div>
            <div className={styles.content}>
                <div className={styles.contentContainer}>
                    <fieldset>
                        <h2 className={styles.h2}>404 - File or directory not found.</h2>
                        <h3 className={styles.h3}>The resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.</h3>
                    </fieldset>
                </div>
            </div>
            <div className={styles.button}>
                <button onClick={()=> router.push("/")}>Go Back to Home Page</button>
            </div>
        </div>
    );
}


export default NotFound;