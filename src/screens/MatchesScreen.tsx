import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { MatchCard } from '../components/MatchCard';
import { UpdatedAgo } from '../components/UpdatedAgo';
import { useMatches } from '../hooks/useMatches';
import { filterMatches, type MatchFilter } from '../utils/matches';
import { useFavorites } from '../hooks/useFavorites';

const FILTERS: { value: MatchFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'upcoming', label: 'Предстоящие' },
  { value: 'finished', label: 'Завершённые' },
];

export function MatchesScreen() {
  const { data, isLoading, isRefreshing, error, updatedAt, refresh } = useMatches();
  const { favorites, isFavorite, toggle } = useFavorites();

  const [filter, setFilter] = useState<MatchFilter>('all');

  const visibleMatches = useMemo(
      () => filterMatches(data?.matches ?? [], filter),
      [data, filter],
  );

  const isPending = isLoading || (isRefreshing && !data);

  return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Матчи тура</Text>

          {data && <Text style={styles.subtitle}>Тур {data.round}</Text>}

          <View style={styles.controls}>
            <View style={styles.filters}>
              {FILTERS.map(item => {
                const selected = filter === item.value;

                return (
                    <Pressable
                        key={item.value}
                        onPress={() => setFilter(item.value)}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        style={[styles.filterButton, selected && styles.filterSelected]}
                    >
                      <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
                        {item.label}
                      </Text>
                    </Pressable>
                );
              })}
            </View>

            <Pressable
                onPress={() => void refresh()}
                disabled={isLoading || isRefreshing}
                accessibilityRole="button"
                style={styles.refreshButton}
            >
              <Text style={styles.refreshText}>
                {isRefreshing ? 'Обновление...' : 'Обновить'}
              </Text>
            </Pressable>
          </View>

          {updatedAt && (
              <View style={styles.updated}>
                <UpdatedAgo since={updatedAt} />
              </View>
          )}

          {error && data && (
              <Text style={styles.errorBanner}>Не удалось обновить матчи: {error}</Text>
          )}

          {isPending ? (
              <View style={styles.stateContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.stateText}>Загружаем матчи...</Text>
              </View>
          ) : error && !data ? (
              <View style={styles.stateContainer}>
                <Text style={styles.stateTitle}>Не удалось загрузить матчи</Text>
                <Text style={styles.stateText}>{error}</Text>

                <Pressable style={styles.retryButton} onPress={() => void refresh()}>
                  <Text style={styles.retryText}>Повторить</Text>
                </Pressable>
              </View>
          ) : (
              <FlatList
                  data={visibleMatches}
                  extraData={favorites}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                      <MatchCard
                          match={item}
                          isFavorite={isFavorite(item.id)}
                          onToggleFavorite={() => toggle(item.id)}
                      />
                  )}
                  contentContainerStyle={styles.list}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                  ListEmptyComponent={
                    <View style={styles.stateContainer}>
                      <Text style={styles.stateTitle}>
                        {data?.matches.length ? 'Нет матчей по выбранному фильтру' : 'Матчей пока нет'}
                      </Text>
                      <Text style={styles.stateText}>
                        {data?.matches.length ? 'Попробуйте выбрать другой фильтр' : 'Список матчей пуст'}
                      </Text>
                    </View>
                  }
              />
          )}
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    paddingTop: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
    marginBottom: 12,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  filterSelected: {
    backgroundColor: '#2563eb',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  filterTextSelected: {
    color: '#ffffff',
  },
  refreshButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#dbeafe',
  },
  refreshText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  updated: {
    marginBottom: 16,
  },
  errorBanner: {
    color: '#b91c1c',
    fontSize: 13,
    marginBottom: 12,
  },
  list: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  separator: {
    height: 12,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  stateTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  stateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    marginTop: 8,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
