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
        <h1 className={styles.title}>Water Usage</h1>

        <p className={styles.description}>
         We recognize that AI models use a significant amount of water that negatively impacts the environment and persons
         without regular access to clean water. That is why the Eco-Dex will be donating half of the ad revenue given to clean 
         water projects. More information about that can be found at fakelink.com
        </p>
        </main>
        </div>
        </>
    );
}