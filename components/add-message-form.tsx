'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { api } from '@/api/api';
import { SEESender } from './SSESender';
import { toast } from 'sonner';

interface Message {
  sender: string;
  content: string;
  color?: string;
}

interface AddMessageFormProps {
  paperId: string;
  onMessageAdded?: (newMessage: Message) => void;
}

export function AddMessageForm({ paperId, onMessageAdded }: AddMessageFormProps) {
  const [sender, setSender] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('bg-pink-100');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sender.trim() || !content.trim()) return;

    setLoading(true);

    try {
      const newMessage = { sender, content, color };

      await api.post(`/rolling-paper/${paperId}/insert`, newMessage);
      await SEESender(paperId, newMessage);

      toast.success('메시지가 등록되었습니다.');

      // if (onMessageAdded) {
      //   onMessageAdded(newMessage);
      // }

      setSender('');
      setContent('');
      setColor('bg-pink-100');
    } catch (error) {
      console.error('메시지 등록 실패:', error);
      toast.error('메시지 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>메시지 남기기</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="author">이름</Label>
            <Input
              id="author"
              placeholder="이름을 입력하세요"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">메시지</Label>
            <Textarea
              id="content"
              placeholder="마음을 담은 메시지를 남겨보세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px]"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>카드 색상</Label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'pink', value: 'bg-pink-100', border: 'border-pink-500' },
                { id: 'blue', value: 'bg-blue-100', border: 'border-blue-500' },
                { id: 'green', value: 'bg-green-100', border: 'border-green-500' },
                { id: 'yellow', value: 'bg-yellow-100', border: 'border-yellow-500' },
                { id: 'purple', value: 'bg-purple-100', border: 'border-purple-500' },
              ].map(({ id, value, border }) => (
                <button
                  key={id}
                  type="button"
                  className={`h-8 w-8 rounded-full ${value} border-2 ${color === value ? border : 'border-muted'}`}
                  onClick={() => setColor(value)}
                  disabled={loading}
                />
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '등록 중...' : '메시지 등록하기'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
