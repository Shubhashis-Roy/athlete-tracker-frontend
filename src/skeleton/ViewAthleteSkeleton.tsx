import React from "react";

const ViewAthleteSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-56 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow space-y-3">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Content Card Skeleton */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="h-6 w-44 bg-gray-200 rounded animate-pulse"></div>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 w-full bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      {/* Table/List Skeleton */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-4"></div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-3 gap-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Action Skeleton */}
      <div className="flex justify-end">
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default ViewAthleteSkeleton;
