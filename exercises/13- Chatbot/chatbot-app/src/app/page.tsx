import { ChatWindow } from '../components/ChatWindow';

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold text-center mb-8">Chat con AI</h1>
      <ChatWindow />
    </main>
  );
}