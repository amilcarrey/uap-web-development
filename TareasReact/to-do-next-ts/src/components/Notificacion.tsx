'use client';
import { useUIStore } from '@/stores/useUIStore';

export default function Notificacion() {
  const { toast } = useUIStore();

  if (!toast) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50">
      {toast}
    </div>
  );
}
