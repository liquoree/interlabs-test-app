import { StyleSheet, Text, View } from 'react-native';
import type { Match } from '../types/match';
import { formatMatchDate, getMatchStatus } from '../utils/matches';
import { FavoriteButton } from './FavoriteButton';

type Props = {
    match: Match;
    isFavorite: boolean;
    onToggleFavorite: () => void;
};

function getStatusStyle(status: Match['status']) {
    switch (status) {
        case 'finished':
            return styles.finishedStatus;
        case 'scheduled':
            return styles.scheduledStatus;
        case 'postponed':
            return styles.postponedStatus;
        case 'live':
            return styles.liveStatus;
        default:
            return styles.unknownStatus;
    }
}

export function MatchCard({ match, isFavorite, onToggleFavorite }: Props) {
    const date = formatMatchDate(match.startsAt);
    const isDateUnknown = date === 'Дата уточняется' || date === 'Дата неизвестна';

    return (
        <View style={styles.card}>
            <View style={styles.favoriteAbsolute}>
                <FavoriteButton active={isFavorite} onPress={onToggleFavorite} />
            </View>
            <View style={[styles.teamRow, styles.firstTeamRow]}>
                <View style={styles.teamInfo}>
                    <Text style={styles.role}>Хозяева</Text>
                    <Text style={styles.teamName}>{match.home.name}</Text>
                    <Text style={styles.city}>{match.home.city}</Text>
                </View>

                <Text style={styles.score}>{match.score?.home ?? '—'}</Text>
            </View>

            <View style={styles.teamRow}>
                <View style={styles.teamInfo}>
                    <Text style={styles.role}>Гости</Text>
                    <Text style={styles.teamName}>{match.away.name}</Text>
                    <Text style={styles.city}>{match.away.city}</Text>
                </View>

                <Text style={styles.score}>{match.score?.away ?? '—'}</Text>
            </View>

            <View style={styles.footer}>
                <Text style={[styles.date, isDateUnknown && styles.unknownDate]}>
                    {date}
                </Text>

                <Text style={[styles.status, getStatusStyle(match.status)]}>
                    {getMatchStatus(match)}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        padding: 16,
    },
    teamRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
        gap: 12,
        paddingRight: 25,
    },
    teamInfo: {
        flex: 1,
    },
    role: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 2,
    },
    teamName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    city: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    score: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        minWidth: 36,
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        paddingTop: 12,
        marginTop: 2,
        gap: 8,
    },
    date: {
        fontSize: 13,
        color: '#6b7280',
    },
    unknownDate: {
        color: '#854d0e',
        backgroundColor: '#fef9c3',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 5,
        overflow: 'hidden',
    },
    status: {
        fontSize: 13,
        fontWeight: '600',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        overflow: 'hidden',
    },
    finishedStatus: {
        color: '#166534',
        backgroundColor: '#dcfce7',
    },
    scheduledStatus: {
        color: '#1d4ed8',
        backgroundColor: '#dbeafe',
    },
    postponedStatus: {
        color: '#92400e',
        backgroundColor: '#fef3c7',
    },
    liveStatus: {
        color: '#991b1b',
        backgroundColor: '#fee2e2',
    },
    unknownStatus: {
        color: '#374151',
        backgroundColor: '#f3f4f6',
    },
    favoriteAbsolute: {
        position: 'absolute',
        top: 12,
        right: 16,
        zIndex: 1,
    },
});
