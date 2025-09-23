// app/page.js

import UploadForm from './components/UploadForm'; // Import the component you just created

export default function HomePage() {
  return (
    <main>
      <h1>Animal Identifier</h1>
      <p>Upload a picture of an animal to learn more about it.</p>
      
      {/* This is where your component will be displayed */}
      <UploadForm />
    </main>
  );
}