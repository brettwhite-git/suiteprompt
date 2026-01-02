'use client';

import { useParams } from 'next/navigation';
import ProgressTracker from '@/components/learning/ProgressTracker';

export default function LearningPathPage() {
  const params = useParams();
  const pathId = params.path as string;

  const handleModuleClick = (moduleId: string) => {
    window.location.href = `/learn/${pathId}/${moduleId}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <ProgressTracker pathId={pathId} onModuleClick={handleModuleClick} />
      </div>
    </main>
  );
}

