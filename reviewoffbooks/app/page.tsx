'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      router.push('/dashboard');
    } else {
      router.push('/welcome');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">📚</div>
        <h1 className="text-2xl font-light text-black mb-2">
          Redirigiendo...
        </h1>
        <p className="text-gray-600">
          Espere mientras lo llevamos a la página correcta
        </p>
      </div>
    </div>
  );
}