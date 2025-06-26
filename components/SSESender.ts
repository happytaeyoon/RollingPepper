import { api } from '@/api/api'; // axios 인스턴스 사용

export async function SEESender(url: string, data: { sender: string; content: string }) {
  try {
    const res = await api.post(`/sse?url=${url}`, data, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
    console.log('✅ 전송 성공:', res.data);
  } catch (err) {
    console.error('❌ 전송 실패:', err);
  }
}
