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
import { toast } from 'sonner';

export default function CreateRollingPaper() {
  const router = useRouter();
  const [recipient, setRecipient] = useState('');
  const [password, setPassword] = useState('');
  const [pscheck, setPscheck] = useState('');
  const [color, setColor] = useState('bg-pink-100'); // 기본 색상

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== pscheck) {
      toast.error('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      const res = await api.post('/rolling-paper/create', {
        recipient,
        password,
        pscheck,
        color,
      });

      const createdId = res.data?.url ?? 1;
      router.push(`/paper/${createdId}`);
    } catch (error) {
      console.error('롤링페이퍼 생성 실패:', error);
      toast.error('롤링페이퍼 생성 중 오류가 발생했습니다.');
    }
  };

  // 색상별 Tailwind 색상 이름과 한글 라벨
  const colorOptions = [
    { id: 'pink', value: 'bg-pink-100', label: '분홍' },
    { id: 'blue', value: 'bg-blue-100', label: '파랑' },
    { id: 'green', value: 'bg-green-100', label: '초록' },
    { id: 'yellow', value: 'bg-yellow-100', label: '노랑' },
    { id: 'purple', value: 'bg-purple-100', label: '보라' },
  ];

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

            {/* 색상 선택 UI */}
            <div className="space-y-2">
              <Label>롤링페이퍼 색상 선택</Label>
              <div className="grid grid-cols-5 gap-3">
                {colorOptions.map(({ id, value, label }) => (
                  <label key={id} htmlFor={id} className="cursor-pointer flex flex-col items-center">
                    <input
                      type="radio"
                      id={id}
                      name="color"
                      value={value}
                      checked={color === value}
                      onChange={() => setColor(value)}
                      className="sr-only"
                    />
                    <div
                      className={`${value} h-10 w-10 rounded-full border-2 ${
                        color === value ? 'border-black' : 'border-gray-300'
                      }`}
                    />
                  </label>
                ))}
              </div>
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
