const LoadingSpinner = ({ size = 'md', fullPage = false }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const spinner = (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} animate-spin rounded-full border-b-2 border-primary-600`}></div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;