import styles from '../page.module.css';


export default function TutorialPage(){
    return (
        <div className={styles.page}>
        <main className={styles.main}>
        <h1 className={styles.title}>Tutorial</h1>
        <h2 className={styles.title}>Animals</h2>
        <p className={styles.description}>
          For images of animals upload your image and then select your location for the best results. 
        </p>
        <h2 className={styles.title}>Plants</h2>
        <p className={styles.description}>
          For the best results upload an image of the full plant, a leaf, the bark/stem, flowering bodies/seeds, and location 
        </p>
        </main>
        </div>
    );
}