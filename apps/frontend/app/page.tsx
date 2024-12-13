import Calendar from './components/Calendar';
import Header from './components/Header';

export default function Home() {
  return (
    <div className='min-h-screen text-gray-100'>
      <Header />
      <main className='container mx-auto p-4'>
        <Calendar />
      </main>
    </div>
  );
}
