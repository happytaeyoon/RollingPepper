'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { AddMessageForm } from '@/components/add-message-form';
import { MessageCard } from '@/components/message-card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { api } from '@/api/api';
import { SSEListener } from './SSEListener';
import { toast } from 'sonner';

interface Message {
  sender: string;
  content: string;
}

interface ClientRollingPaperProps {
  paperId: string;
}

export default function ClientRollingPaper({ paperId }: ClientRollingPaperProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [paperTitle, setPaperTitle] = useState('');
  const [password, setPassword] = useState('');
  const [finishStatus, setFinishStatus] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const paperData = {
    id: paperId,
    title: paperTitle,
    theme: 'birthday',
  };

  const finishRollingPaper = async () => {
    setFinishing(true);
    setFinishStatus(false);
    try {
      const res = await api.put(`/rolling-paper/${paperId}/finish`, { password });
      setFinishStatus(true);
      toast('종료 되었습니다');
      setIsDialogOpen(false);
      setIsFinished(true);
    } catch (err: any) {
      setFinishStatus(err.response?.data?.message || '종료 실패: 비밀번호를 확인하세요');
      console.log('dfa', err);
      toast.error(err.response?.data?.error);
    } finally {
      setFinishing(false);
    }
  };

  async function fetchMessages() {
    try {
      setLoading(true);
      const res = await api.get(`/rolling-paper/${paperId}`);
      setMessages(res.data.papers || []);
      setPaperTitle(res.data.recipient || '메시지 1');
      setIsFinished(res.data.finished);
    } catch (error) {
      console.error('메시지 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleMessageAdded = (newMessage: Message) => {
    setMessages((prev) => [...prev, newMessage]);
  };

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
          <div className="flex center gap-3">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <X className="mr-2 h-4 w-4" />
                  종료하기
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div className="p-4 text-center">
                  <DialogTitle>롤링페이퍼 종료하기</DialogTitle> {/* 필수 */}
                  <p className="mb-4 text-muted-foreground">비밀번호를 입력하세요</p>
                  <div className="flex">
                    <Input
                      className="mr-2"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="비밀번호"
                      disabled={finishing}
                    />
                    <Button onClick={finishRollingPaper} disabled={finishing}>
                      {finishing ? '진행 중...' : '완료'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  공유하기
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div className="p-4 text-center">
                  <DialogTitle>롤링페이퍼 공유하기</DialogTitle>
                  <p className="mb-4 text-muted-foreground">아래 링크를 복사하여 공유하세요:</p>
                  <div className="flex">
                    <Input
                      readOnly
                      value={`https://rolling-pepper.vercel.app/paper/${paperData.id}`}
                      className="mr-2"
                    />
                    <Button
                      onClick={() =>
                        navigator.clipboard.writeText(`https://rolling-pepper.vercel.app/paper/${paperData.id}`)
                      }
                    >
                      복사
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
        {!isFinished && (
          <div className="max-w-2xl mx-auto">
            <AddMessageForm paperId={paperId} onMessageAdded={handleMessageAdded} />
          </div>
        )}
      </div>
    </main>
  );
}
