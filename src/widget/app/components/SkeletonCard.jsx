import React from 'react';

export default function SkeletonCard() {
  return (
    <article className="el-card-animate w-full rounded border border-legal-border bg-[#f7f3e9] px-4 py-4 shadow-panel">
      <div className="el-skeleton-line h-4 w-40 rounded" />
      <div className="el-skeleton-line mt-4 h-3 w-full rounded" />
      <div className="el-skeleton-line mt-2 h-3 w-[88%] rounded" />
      <div className="el-skeleton-line mt-2 h-3 w-[73%] rounded" />
      <div className="el-skeleton-line mt-4 h-3 w-[60%] rounded" />
    </article>
  );
}
