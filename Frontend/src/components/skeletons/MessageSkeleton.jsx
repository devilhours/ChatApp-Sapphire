const MessageSkeleton = () => {
  // Create an array to map over for skeleton messages
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6">
      {skeletonMessages.map((_, idx) => {
        // Alternate between sender and receiver layout
        const isSender = idx % 2 !== 0;

        return (
          <div
            key={idx}
            className={`flex items-end gap-3 my-4 animate-pulse ${
              isSender ? "justify-end" : "justify-start"
            }`}
          >
            {/* --- Avatar skeleton (only for receiver) --- */}
            {!isSender && <div className="w-8 h-8 bg-gray-700 rounded-full" />}

            {/* --- Bubble skeleton with varied widths for realism --- */}
            <div className="flex flex-col gap-2">
              <div
                className={`h-10 bg-gray-700 rounded-2xl ${
                  isSender ? "w-40" : "w-48"
                }`}
              />
              {/* Occasionally show a second line for variety */}
              {idx % 3 === 0 && (
                <div
                  className={`h-6 bg-gray-700 rounded-2xl ${
                    isSender ? "w-24" : "w-32"
                  }`}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageSkeleton;
