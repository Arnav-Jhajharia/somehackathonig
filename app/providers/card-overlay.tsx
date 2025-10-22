import * as Haptics from 'expo-haptics';
import * as React from 'react';
import { Animated, Easing, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type CardOverlayContextValue = {
  show: () => void;
};

const CardOverlayContext = React.createContext<CardOverlayContextValue | null>(null);

export function useCardOverlay() {
  const ctx = React.useContext(CardOverlayContext);
  if (!ctx) throw new Error('useCardOverlay must be used within CardOverlayProvider');
  return ctx;
}

export function CardOverlayProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = React.useState(false);
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;
  const cardTranslateY = React.useRef(new Animated.Value(-220)).current;
  const cardScale = React.useRef(new Animated.Value(0.9)).current;

  const hide = React.useCallback(() => {
    Animated.parallel([
      Animated.timing(overlayOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
      Animated.timing(cardTranslateY, {
        toValue: -260,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      cardTranslateY.setValue(-220);
      cardScale.setValue(0.9);
    });
  }, [overlayOpacity, cardScale, cardTranslateY]);

  const show = React.useCallback(() => {
    if (visible) return;
    setVisible(true);
    Haptics.selectionAsync().catch(() => {});
    overlayOpacity.setValue(0);
    cardTranslateY.setValue(-220);
    cardScale.setValue(0.94);

    Animated.parallel([
      Animated.timing(overlayOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.spring(cardTranslateY, { toValue: 84, damping: 14, stiffness: 160, mass: 0.8, useNativeDriver: true }),
      Animated.spring(cardScale, { toValue: 1, damping: 16, stiffness: 180, mass: 0.9, useNativeDriver: true }),
    ]).start(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setTimeout(() => hide(), 1400);
    });
  }, [visible, overlayOpacity, cardTranslateY, cardScale, hide]);

  const value = React.useMemo(() => ({ show }), [show]);

  return (
    <CardOverlayContext.Provider value={value}>
      {children}
      <Modal visible={visible} transparent animationType="none" onRequestClose={hide}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, { opacity: overlayOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={hide} />
          <Animated.View style={[styles.cardContainer, { transform: [{ translateY: cardTranslateY }, { scale: cardScale }] }]}>
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardBadge} />
                <Text style={styles.cardTier}>GlobleTrotter+</Text>
              </View>
              <View style={styles.cardSpacer} />
              <Text style={styles.cardHint}>Hold near reader…</Text>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </CardOverlayContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.42)',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    paddingTop: 24,
    alignItems: 'center',
  },
  card: {
    width: 320,
    height: 190,
    borderRadius: 20,
    backgroundColor: '#0E1B2A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    padding: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardBadge: {
    width: 44,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#1E2A3A',
  },
  cardTier: {
    color: '#E7E2DC',
    fontWeight: '700',
    fontSize: 18,
  },
  cardSpacer: { flex: 1 },
  cardHint: {
    color: 'rgba(231,226,220,0.8)',
    fontSize: 14,
  },
});


