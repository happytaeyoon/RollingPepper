'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/api/api';
import { toast, Toaster } from 'sonner';

export default function CreateRollingPaper() {
  const router = useRouter();
  const [recipient, setRecipient] = useState('');
  const [password, setPassword] = useState('');
  const [pscheck, setPscheck] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post('/rolling-paper/create', {
        recipient,
        password: password,
        pscheck: pscheck,
      });

      const createdId = res.data?.url ?? 1; // 생성된 ID 반환값 없을 경우 대비
      router.push(`/paper/${createdId}`);
    } catch (error) {
      console.error('롤링페이퍼 생성 실패:', error);
      toast.error('롤링페이퍼 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <main className="container mx-auto py-8 px-4 max-w-2xl">
      <Button variant="ghost" className="mb-6" onClick={() => router.push('/')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        돌아가기
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">새 롤링페이퍼 만들기</CardTitle>
          <CardDescription>친구, 동료, 또는 사랑하는 사람을 위한 롤링페이퍼를 만들어보세요.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="recipient">받는 사람 이름</Label>
              <Input
                id="recipient"
                placeholder="예: 민지"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력해주세요."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pscheck">비밀번호 확인</Label>
              <Input
                id="pscheck"
                type="password"
                placeholder="비밀번호를 다시 입력해주세요."
                value={pscheck}
                onChange={(e) => setPscheck(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              롤링페이퍼 만들기
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
