import React from "react";

const EditAthleteSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 mx-[20%]">
      {/* Page Header */}
      <div className="mb-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        {/* Section Title */}
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>

        {/* Form Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="flex justify-end">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-4 gap-4 items-center">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditAthleteSkeleton;
