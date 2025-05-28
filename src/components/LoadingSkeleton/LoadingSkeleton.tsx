import type { ReactNode } from "react";

interface LoadingSkeletonProps {
  variant?: "card" | "list" | "custom";
  count?: number;
  className?: string;
  children?: ReactNode;
}

interface SkeletonItemProps {
  className?: string;
}

const SkeletonItem = ({ className = "" }: SkeletonItemProps) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    aria-label="Loading content"
  />
);

const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
    <SkeletonItem className="h-6 w-3/4" />
    <SkeletonItem className="h-4 w-full" />
    <SkeletonItem className="h-4 w-5/6" />
    <div className="flex justify-between items-center pt-4">
      <SkeletonItem className="h-4 w-1/4" />
      <SkeletonItem className="h-8 w-20 rounded-md" />
    </div>
  </div>
);

const SkeletonListItem = () => (
  <div className="bg-white rounded-lg shadow-sm border p-4 flex items-center space-x-4">
    <SkeletonItem className="h-12 w-12 rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <SkeletonItem className="h-5 w-1/3" />
      <SkeletonItem className="h-4 w-2/3" />
    </div>
    <SkeletonItem className="h-8 w-24 rounded-md" />
  </div>
);

const LoadingSkeleton = ({
  variant = "card",
  count = 8,
  className = "",
  children,
}: LoadingSkeletonProps) => {
  if (children) {
    return (
      <div
        className={`animate-pulse ${className}`}
        role="status"
        aria-label="Loading"
      >
        {children}
      </div>
    );
  }

  const renderSkeletonItems = () => {
    return Array.from({ length: count }, (_, index) => {
      switch (variant) {
        case "card":
          return <SkeletonCard key={index} />;
        case "list":
          return <SkeletonListItem key={index} />;
        default:
          return <SkeletonCard key={index} />;
      }
    });
  };

  const containerClasses = {
    card: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
    list: "space-y-3",
    custom: "",
  };

  return (
    <div
      className={`${containerClasses[variant]} ${className}`}
      role="status"
      aria-label="Loading content"
      data-testid="loading-skeleton"
    >
      {renderSkeletonItems()}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Export individual skeleton components for more granular control
export { SkeletonItem, SkeletonCard, SkeletonListItem };
export default LoadingSkeleton;
