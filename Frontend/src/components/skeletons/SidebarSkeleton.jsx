import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  // Create an array to map over for skeleton items
  const skeletonItems = Array(8).fill(null);

  return (
    // --- MODIFIED: Main container matching the new Sidebar theme ---
    <aside className="h-full w-20 lg:w-72 bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300 ease-in-out">
      {/* Skeleton Header */}
      <div className="border-b border-gray-700 w-full p-4">
        <div className="flex items-center gap-2">
          <Users className="size-6 text-gray-700" />
          {/* Skeleton for "Contacts" title */}
          <div className="h-5 w-24 bg-gray-700 rounded-md hidden lg:block animate-pulse" />
        </div>

        {/* Skeleton for the filter toggle */}
        <div className="mt-4 hidden lg:flex items-center justify-between">
          <div className="h-4 w-20 bg-gray-700 rounded-md animate-pulse" />
          <div className="h-5 w-9 bg-gray-700 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Skeleton User List */}
      <div className="flex-1 overflow-y-auto py-2">
        {skeletonItems.map((_, idx) => (
          <div
            key={idx}
            className="w-full p-2 lg:p-3 flex items-center gap-3 justify-center lg:justify-start"
          >
            {/* Avatar skeleton */}
            <div className="w-12 h-12 bg-gray-700 rounded-full animate-pulse" />

            {/* User info skeleton (name and status) */}
            <div className="hidden lg:block flex-1">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2 animate-pulse" />
              <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
