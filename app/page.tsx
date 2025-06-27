'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/api/api';

interface PaperGroup {
  recipient: string;
  finished: boolean;
  url: string;
  papers: any[];
}

export default function Home() {
  const [rollingPapers, setRollingPapers] = useState<PaperGroup[]>([]);

  const getAllRollingPapers = async () => {
    const res = await api.get<PaperGroup[]>('/rolling-paper');
    return res.data;
  };

  useEffect(() => {
    const fetchRollingPapers = async () => {
      try {
        const data = await getAllRollingPapers();
        setRollingPapers(data);
      } catch (e) {
        console.error('에러 발생:', e);
      }
    };

    fetchRollingPapers();
  }, []);

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">롤링페이퍼</h1>
          <p className="text-muted-foreground mt-2">소중한 사람들에게 마음을 전하는 디지털 메시지 보드</p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/create">
            <PlusCircle className="mr-2 h-4 w-4" />새 롤링페이퍼 만들기
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rollingPapers.map((paper) => (
          <Link href={`/paper/${paper.url}`} key={paper.url} className="block">
            <Card
              className={`h-full transition-all hover:shadow-md ${
                paper.finished ? 'bg-gray-100 text-gray-500 cursor-not-allowed opacity-70' : 'bg-white text-black'
              }`}
            >
              <CardHeader>
                <CardTitle className="line-clamp-2">{paper.recipient}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gradient-to-r from-pink-100 to-rose-100 rounded-md flex items-center justify-center">
                  <span className="text-lg font-medium text-rose-600">{paper.papers.length}개의 메시지</span>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                완료 상태: {paper.finished ? '완료' : '진행 중'}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
