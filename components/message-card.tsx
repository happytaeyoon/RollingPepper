import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface Message {
  sender: string;
  content: string;
  color?: string;
}

interface MessageCardProps {
  message: Message;
}

export function MessageCard({ message }: MessageCardProps) {
  const getRandomRotation = () => {
    // 약간의 랜덤 회전 효과를 줍니다 (-3도 ~ 3도)
    const rotation = Math.floor(Math.random() * 7) - 3;
    return `rotate-[${rotation}deg]`;
  };

  return (
    <Card className={`${message.color ?? 'bg-pink-100'} ${getRandomRotation()} hover:shadow-md transition-all`}>
      <CardHeader className="pb-2">
        <div className="font-medium">{message.sender}</div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{message.content}</p>
      </CardContent>
    </Card>
  );
}
