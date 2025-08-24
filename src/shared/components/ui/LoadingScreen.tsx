export const LoadingScreen = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center h-screen bg-gray-50 ${className || ''}`}>
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};
