
import type { Match, MatchScore, MatchesResponse, Team } from '../types/match';

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isTeam(value: unknown): value is Team {
    return isRecord(value) &&
        typeof value.id === 'string' &&
        typeof value.name === 'string' &&
        typeof value.city === 'string';
}

function isMatchScore(value: unknown): value is MatchScore {
    return isRecord(value) &&
        typeof value.home === 'number' &&
        Number.isInteger(value.home) &&
        value.home >= 0 &&
        typeof value.away === 'number' &&
        Number.isInteger(value.away) &&
        value.away >= 0;
}

function isMatch(value: unknown): value is Match {
    return isRecord(value) &&
        typeof value.id === 'string' &&
        (typeof value.startsAt === 'string' || value.startsAt === null) &&
        typeof value.status === 'string' &&
        isTeam(value.home) &&
        isTeam(value.away) &&
        (value.score === null || isMatchScore(value.score)) &&
        (value.minute === undefined || (
            typeof value.minute === 'number' &&
            Number.isInteger(value.minute) &&
            value.minute >= 0
        ));
}

export function isMatchesResponse(value: unknown): value is MatchesResponse {
    return isRecord(value) &&
        typeof value.round === 'number' &&
        Number.isInteger(value.round) &&
        value.round >= 0 &&
        Array.isArray(value.matches) &&
        value.matches.every(isMatch);
}
