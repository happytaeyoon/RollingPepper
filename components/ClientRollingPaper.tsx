'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { AddMessageForm } from '@/components/add-message-form';
import { MessageCard } from '@/components/message-card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { api } from '@/api/api';
import { SSEListener } from './SSEListener';

interface Message {
  sender: string;
  content: string;
  color?: string;
}

interface ClientRollingPaperProps {
  paperId: string;
}

export default function ClientRollingPaper({ paperId }: ClientRollingPaperProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [paperTitle, setPaperTitle] = useState('');
  const paperData = {
    id: paperId,
    title: paperTitle,
    theme: 'birthday',
  };

  async function fetchMessages() {
    try {
      setLoading(true);
      const res = await api.get(`/rolling-paper/${paperId}`);
      setMessages(res.data.papers || []);
      setPaperTitle(res.data.recipient || '메시지 1');
    } catch (error) {
      console.error('메시지 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, [paperId]);

  const getBackgroundClass = () => {
    switch (paperData.theme) {
      case 'birthday':
        return 'bg-gradient-to-r from-pink-50 to-rose-50';
      case 'graduation':
        return 'bg-gradient-to-r from-blue-50 to-sky-50';
      case 'farewell':
        return 'bg-gradient-to-r from-amber-50 to-yellow-50';
      case 'thanks':
        return 'bg-gradient-to-r from-green-50 to-emerald-50';
      default:
        return 'bg-gradient-to-r from-pink-50 to-rose-50';
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8 px-4">로딩 중...</div>;
  }

  return (
    <main className={`min-h-screen py-8 px-4 ${getBackgroundClass()}`}>
      <SSEListener
        url={paperId}
        onEvent={(data) => {
          if (data.includes('SSE 연결됨')) return;
        }}
        onPaperEvent={(message) => {
          setMessages((prev) => [...prev, message]);
        }}
      />

      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              돌아가기
            </Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                공유하기
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="p-4 text-center">
                <h3 className="text-lg font-medium mb-2">롤링페이퍼 공유하기</h3>
                <p className="mb-4 text-muted-foreground">아래 링크를 복사하여 공유하세요:</p>
                <div className="flex">
                  <Input readOnly value={`http://localhost:3000/paper/${paperData.id}`} className="mr-2" />
                  <Button onClick={() => navigator.clipboard.writeText(`http://localhost:3000/paper/${paperData.id}`)}>
                    복사
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{paperData.title}</h1>
          <p className="text-muted-foreground mt-2">메시지를 남겨 마음을 전해보세요!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {messages.length === 0 ? (
            <p className="text-center col-span-full">등록된 메시지가 없습니다.</p>
          ) : (
            messages.map((message, index) => <MessageCard key={index} message={message} />)
          )}
        </div>

        <div className="max-w-2xl mx-auto">
          <AddMessageForm paperId={paperId} onMessageAdded={fetchMessages} />
        </div>
      </div>
    </main>
  );
}
