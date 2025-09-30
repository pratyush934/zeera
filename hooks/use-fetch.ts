import { useState } from "react";
import { toast } from "sonner";

// Generic type for the callback function
type CallbackFunction<T = unknown, P extends unknown[] = unknown[]> = (...args: P) => Promise<T>;

// Custom hook for handling async operations with loading, error, and data states
export const useFetch = <T = unknown, P extends unknown[] = unknown[]>(cb: CallbackFunction<T, P>) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to execute the callback with proper error handling
  const fn = async (...args: P): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, fn, setData };
};
