import styles from '../page.module.css';
import Header from '../components/Header';

export default function AboutPage(){
    return (
      <>
      <Header/>
        <div className={styles.page}>
        <main className={styles.main}>
        <h1 className={styles.title}>About</h1>
        <p className={styles.description}>
          This is a project created by a group of seniors at the University of Northern Colorado. Passionate about animals
          and the environment, our goal is to help educate people on the natural world around them using modern technology
          and resources all in one spot. 
        </p>
        </main>
        </div>
        </>
    );
}