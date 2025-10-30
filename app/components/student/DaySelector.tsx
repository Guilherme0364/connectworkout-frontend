/**
 * DaySelector Component
 *
 * Horizontal scrollable day selector for workout days
 * Highlights today and the selected day
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Theme } from '../../styles/theme';

interface DaySelectorProps {
  workoutDays: Array<{ id: number; dayOfWeek: number; exercisesCount?: number }>;
  selectedDay: number | null;
  onDaySelect: (dayOfWeek: number) => void;
}

const DAY_NAMES = {
  short: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  full: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
};

const DaySelector: React.FC<DaySelectorProps> = ({
  workoutDays,
  selectedDay,
  onDaySelect,
}) => {
  const today = new Date().getDay();

  const isToday = (dayOfWeek: number) => today === dayOfWeek;
  const isSelected = (dayOfWeek: number) => selectedDay === dayOfWeek;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {workoutDays
          .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
          .map((day) => {
            const todayFlag = isToday(day.dayOfWeek);
            const selectedFlag = isSelected(day.dayOfWeek);

            return (
              <Pressable
                key={day.id}
                style={[
                  styles.dayButton,
                  todayFlag && styles.dayButtonToday,
                  selectedFlag && styles.dayButtonSelected,
                ]}
                onPress={() => onDaySelect(day.dayOfWeek)}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedFlag && styles.dayTextSelected,
                  ]}
                >
                  {DAY_NAMES.short[day.dayOfWeek]}
                </Text>

                {todayFlag && !selectedFlag && (
                  <View style={styles.todayIndicator} />
                )}

                {day.exercisesCount !== undefined && (
                  <Text
                    style={[
                      styles.exerciseCount,
                      selectedFlag && styles.exerciseCountSelected,
                    ]}
                  >
                    {day.exercisesCount} ex
                  </Text>
                )}
              </Pressable>
            );
          })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Theme.colors.background,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  dayButtonToday: {
    borderColor: Theme.colors.success,
    borderWidth: 2,
  },
  dayButtonSelected: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
  },
  dayTextSelected: {
    color: '#FFFFFF',
  },
  todayIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.colors.success,
    marginTop: 4,
  },
  exerciseCount: {
    fontSize: 10,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  exerciseCountSelected: {
    color: '#FFFFFF',
    opacity: 0.9,
  },
});

export default DaySelector;
export { DAY_NAMES };
