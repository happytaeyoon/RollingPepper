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

interface AddMessageFormProps {
  paperId: string;
  onMessageAdded?: () => void; // 메시지 등록 후 동작 콜백
}

export function AddMessageForm({ paperId, onMessageAdded }: AddMessageFormProps) {
  const [sender, setSender] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sender.trim() || !content.trim()) return;

    setLoading(true);

    try {
      await api.post(`/rolling-paper/${paperId}/insert`, {
        sender,
        content,
      });
      await SEESender(paperId, { sender, content });

      toast.success('메시지가 등록되었습니다.');

      setSender('');
      setContent('');
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
