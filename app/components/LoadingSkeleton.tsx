/**
 * LoadingSkeleton Component
 *
 * Skeleton loaders for different content types
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Theme } from '../styles/theme';

type SkeletonType = 'workout' | 'exercise' | 'day' | 'list';

interface LoadingSkeletonProps {
  type: SkeletonType;
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type, count = 1 }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  const renderWorkoutSkeleton = () => (
    <View style={styles.workoutCard}>
      <Animated.View style={[styles.skeletonLine, styles.titleLine, { opacity }]} />
      <View style={styles.row}>
        <Animated.View style={[styles.skeletonLine, styles.smallLine, { opacity }]} />
        <Animated.View style={[styles.skeletonLine, styles.smallLine, { opacity }]} />
      </View>
      <Animated.View style={[styles.skeletonLine, styles.badge, { opacity }]} />
    </View>
  );

  const renderExerciseSkeleton = () => (
    <View style={styles.exerciseCard}>
      <View style={styles.row}>
        <Animated.View style={[styles.skeletonBox, styles.gifBox, { opacity }]} />
        <View style={styles.exerciseInfo}>
          <Animated.View style={[styles.skeletonLine, styles.titleLine, { opacity }]} />
          <Animated.View style={[styles.skeletonLine, styles.mediumLine, { opacity }]} />
          <Animated.View style={[styles.skeletonLine, styles.smallLine, { opacity }]} />
        </View>
      </View>
    </View>
  );

  const renderDaySkeleton = () => (
    <View style={styles.dayCard}>
      <Animated.View style={[styles.skeletonLine, styles.titleLine, { opacity }]} />
      <Animated.View style={[styles.skeletonLine, styles.smallLine, { opacity }]} />
    </View>
  );

  const renderListSkeleton = () => (
    <View style={styles.listItem}>
      <Animated.View style={[styles.skeletonLine, styles.mediumLine, { opacity }]} />
      <Animated.View style={[styles.skeletonLine, styles.smallLine, { opacity }]} />
    </View>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'workout':
        return renderWorkoutSkeleton();
      case 'exercise':
        return renderExerciseSkeleton();
      case 'day':
        return renderDaySkeleton();
      case 'list':
        return renderListSkeleton();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index}>{renderSkeleton()}</View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  workoutCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  exerciseCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dayCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listItem: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  skeletonLine: {
    height: 16,
    backgroundColor: Theme.components.skeleton,
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonBox: {
    backgroundColor: Theme.components.skeleton,
    borderRadius: 8,
  },
  titleLine: {
    width: '70%',
    height: 20,
  },
  mediumLine: {
    width: '50%',
  },
  smallLine: {
    width: '30%',
  },
  badge: {
    width: 60,
    height: 24,
  },
  gifBox: {
    width: 80,
    height: 80,
  },
});

export default LoadingSkeleton;
