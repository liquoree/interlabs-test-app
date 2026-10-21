import { MATCHES_URL } from '../config';
import type { MatchesResponse } from '../types/match';
import { isMatchesResponse } from './matches.validation';

export async function getMatches(signal?: AbortSignal): Promise<MatchesResponse> {
    const response = await fetch(MATCHES_URL, { signal });

    if (!response.ok) {
        throw new Error(`Ошибка загрузки матчей: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!isMatchesResponse(data)) {
        throw new Error('Некорректный формат данных');
    }

    return data;
}
