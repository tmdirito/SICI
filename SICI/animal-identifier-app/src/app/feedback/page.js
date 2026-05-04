import Header from '../components/Header';
import styles from '../page.module.css';

export default function ExpertFeedbackPage() {
  const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdHckOBRtCGCoDqWvujecsS9VQfj3cAUKTzy2DfXn7kxkue6Q/viewform";

  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <h1 className={styles.title} style={{ color: 'var(--secondary-text)' }}>Expert Feedback</h1>
          <p style={{ marginBottom: '2rem', textAlign: 'center', lineHeight: '1.6', color: 'var(--secondary-text)' }}>
            Notice an inaccuracy or have suggestions for our database? We value your expertise! 
            Please submit your corrections and research feedback using our dedicated form.
          </p>

          {/* Links out to the Google Form in a new tab */}
          <a 
            href={googleFormUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ width: '100%', textDecoration: 'none' }}
          >
            <button className={styles.button} style={{ width: '100%' }}>
              Open Feedback Form
            </button>
          </a>
          
        </main>
      </div>
    </>
  );
}