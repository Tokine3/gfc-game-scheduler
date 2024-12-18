export function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen space-y-4'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-100' />
      {message && <p className='text-gray-400 text-sm'>{message}</p>}
    </div>
  );
}
