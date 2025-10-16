import styles from '../page.module.css';


export default function InfoPage(){
    return(
        <div className={styles.page}>
        <main className={styles.main}>
        <h1 className={styles.title}>Info</h1>
        <p className={styles.description}>
            Lorem Ipsum... 
        </p>
        </main>
        </div>
    );
}