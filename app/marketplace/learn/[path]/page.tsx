'use client';

import { useParams } from 'next/navigation';
import ProgressTracker from '@/components/learning/ProgressTracker';

export default function LearningPathPage() {
  const params = useParams();
  const pathId = params.path as string;

  const handleModuleClick = (moduleId: string) => {
    window.location.href = `/marketplace/learn/${pathId}/${moduleId}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Learning Path</h1>
        <p className="text-muted-foreground mt-2">
          Track your progress through the learning modules
        </p>
      </div>
      <ProgressTracker pathId={pathId} onModuleClick={handleModuleClick} />
    </div>
  );
}

