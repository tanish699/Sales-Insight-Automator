import Header from './components/Header';
import UploadForm from './components/UploadForm';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 pb-12">
      <Header />
      <UploadForm />
      <footer className="mt-10 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-widest">
          Powered by Rabbitt AI
        </p>
      </footer>
    </main>
  );
}
