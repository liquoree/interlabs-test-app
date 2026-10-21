import { useCallback, useEffect, useRef, useState } from 'react';
import { getMatches } from '../api/matches';
import type { MatchesResponse } from '../types/match';

export function useMatches() {
    const [data, setData] = useState<MatchesResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

    const controllerRef = useRef<AbortController | null>(null);

    const loadMatches = useCallback(async (refresh = false) => {
        controllerRef.current?.abort();

        const controller = new AbortController();
        controllerRef.current = controller;

        setError(null);

        if (refresh) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }

        try {
            const result = await getMatches(controller.signal);

            if (controller.signal.aborted) return;

            setData(result);
            setUpdatedAt(new Date());
        } catch (err) {
            if (controller.signal.aborted) return;

            setError(err instanceof Error ? err.message : 'Неизвестная ошибка загрузки');
        } finally {
            if (!controller.signal.aborted) {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        }
    }, []);

    useEffect(() => {
        void loadMatches();

        return () => controllerRef.current?.abort();
    }, [loadMatches]);

    return {
        data,
        isLoading,
        isRefreshing,
        error,
        updatedAt,
        refresh: () => loadMatches(true),
    };
}
