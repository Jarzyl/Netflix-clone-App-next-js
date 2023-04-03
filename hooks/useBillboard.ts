import useSwr from 'swr'
import fetcher from '@/libs/fetcher';

// Load the data only once, theres no sense to refresh it every time when user go out of the window

const useBillboard = () => {
  const { data, error, isLoading } = useSwr('/api/random', fetcher, { 
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
   });
  return {
    data,
    error,
    isLoading
  };
};

export default useBillboard;
