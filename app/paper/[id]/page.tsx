// app/paper/[id]/page.tsx
import ClientRollingPaper from '@/components/ClientRollingPaper';

export default async function RollingPaperPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const paperId = resolvedParams.id;

  return <ClientRollingPaper paperId={paperId} />;
}
