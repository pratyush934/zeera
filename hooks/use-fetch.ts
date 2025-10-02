import { useState, useCallback } from "react";
import { toast } from "sonner";

type CallbackFunction<T = unknown, P extends unknown[] = unknown[]> = (
  ...args: P
) => Promise<T>;

export const useFetch = <T = unknown, P extends unknown[] = unknown[]>(
  cb: CallbackFunction<T, P>
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fn = useCallback(
    async (...args: P): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await cb(...args);
        setData(response);
        setError(null);
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "An unexpected error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [cb]
  ); 

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearData = useCallback(() => {
    setData(null);
  }, []);

  return { data, error, isLoading, fn, setData, clearError, clearData };
};
