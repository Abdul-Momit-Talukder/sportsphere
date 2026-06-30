const LoadingSpinner = ({ fullScreen = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 ${sizeClasses[size]}`}
    />
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
