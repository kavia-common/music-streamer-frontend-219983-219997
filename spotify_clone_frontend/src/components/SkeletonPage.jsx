import React from 'react';

export default function SkeletonPage() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-56 bg-white/10 rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-40 bg-white/10 rounded animate-pulse" />
        <div className="h-40 bg-white/10 rounded animate-pulse" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-12 bg-white/10 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}
