
import type { Match } from '../types/match';

export type MatchFilter = 'all' | 'upcoming' | 'finished';

export function filterMatches(matches: Match[], filter: MatchFilter): Match[] {
    switch (filter) {
        case 'upcoming':
            return matches.filter(match => match.status === 'scheduled' || match.status === 'postponed');
        case 'finished':
            return matches.filter(match => match.status === 'finished');
        default:
            return matches;
    }
}

export function getMatchStatus(match: Match): string {
    switch (match.status) {
        case 'scheduled':
            return 'Предстоящий';
        case 'finished':
            return 'Завершён';
        case 'postponed':
            return 'Перенесён';
        case 'live':
            return match.minute !== undefined ? `Идёт матч, ${match.minute}-я минута` : 'Идёт матч';
        default:
            return 'Статус неизвестен';
    }
}

export function formatMatchDate(startsAt: string | null): string {
    if (!startsAt) return 'Дата уточняется';

    const date = new Date(startsAt);

    if (Number.isNaN(date.getTime())) {
        return 'Дата неизвестна';
    }

    return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}
