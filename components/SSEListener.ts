'use client';

import { useEffect, useRef } from 'react';
import { api } from '@/api/api';
interface SSEListenerProps {
  url: string;
  onEvent: (data: string) => void;
  onPaperEvent?: (message: { sender: string; content: string }) => void;
}

export function SSEListener({ url, onEvent, onPaperEvent }: SSEListenerProps) {
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const connect = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      //test
      const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}/sse?url=${url}&ngrok-skip-browser-warning=true`;
      const es = new EventSource(fullUrl);

      es.onmessage = (event) => {
        console.log('📨 SSE 수신:', event.data);
        onEvent(event.data);
      };
      es.addEventListener('paper', (event: MessageEvent) => {
        console.log('📨 SSE paper 이벤트:', event.data);
        if (onPaperEvent) {
          try {
            const parsed = JSON.parse(event.data);
            onPaperEvent(parsed);
          } catch {
            console.error('SSE paper 이벤트 데이터 파싱 실패');
          }
        }
      });

      es.onerror = (err) => {
        console.error('❌ SSE 오류', err);
        es.close();
      };

      eventSourceRef.current = es;
    };

    connect();

    const reconnectInterval = setInterval(() => {
      console.log('🔁 SSE 재연결');
      connect();
    }, 60000); // 60초마다 재연결

    return () => {
      eventSourceRef.current?.close();
      clearInterval(reconnectInterval);
    };
  }, [url, onEvent, onPaperEvent]);

  return null;
}
