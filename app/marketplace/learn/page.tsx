'use client';

import PathSelector from '@/components/learning/PathSelector';
import Search from '@/components/ui/Search';

export default function LearnPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Learning Center</h1>
        <p className="text-muted-foreground mt-2">
          Learn SuiteCloud development through visual guides, animations, and interactive tutorials
        </p>
      </div>
      
      <div className="mb-12 flex justify-center">
        <Search />
      </div>
      
      <PathSelector />
    </div>
  );
}

