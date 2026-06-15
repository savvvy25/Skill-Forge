import { useState, useEffect, useCallback } from 'react';
import { getProgress as fetchProgressAPI, addProgress as addProgressAPI, updateProgress as updateProgressAPI, deleteProgress as deleteProgressAPI } from '../services/api';

export function useProgress() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchProgressAPI();
      // Backend wraps in ApiResponse: { success, message, data: [...] }
      const data = response.data?.data || response.data || [];
      setProgress(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch progress');
      console.error('Fetch progress error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const addProgress = useCallback(async (data) => {
    const response = await addProgressAPI(data);
    await fetchProgress();
    return response.data;
  }, [fetchProgress]);

  const updateProgress = useCallback(async (id, data) => {
    const response = await updateProgressAPI(id, data);
    await fetchProgress();
    return response.data;
  }, [fetchProgress]);

  const deleteProgress = useCallback(async (id) => {
    const response = await deleteProgressAPI(id);
    await fetchProgress();
    return response.data;
  }, [fetchProgress]);

  return {
    progress,
    loading,
    error,
    fetchProgress,
    addProgress,
    updateProgress,
    deleteProgress,
  };
}

export default useProgress;
