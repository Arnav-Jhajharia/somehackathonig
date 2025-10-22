import * as Haptics from 'expo-haptics';
import { useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Transaction = {
  id: string;
  merchant: string;
  amount: number;
  date: Date;
  category: string;
  reward?: number;
};

export default function CardScreen() {
  const insets = useSafeAreaInsets();
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', merchant: 'Starbucks Reserve', amount: 45.20, date: new Date(Date.now() - 3600000), category: 'Dining', reward: 2.26 },
    { id: '2', merchant: 'Uber', amount: 28.50, date: new Date(Date.now() - 7200000), category: 'Transport' },
    { id: '3', merchant: 'The Ritz Hotel', amount: 450.00, date: new Date(Date.now() - 86400000), category: 'Travel', reward: 45.00 },
  ]);
  const [newTransactionId, setNewTransactionId] = useState<string | null>(null);
  const animatedValue = useRef(new Animated.Value(1)).current;

  const handleCardTap = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Create a new mock transaction
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      merchant: getMockMerchant(),
      amount: Math.random() * 100 + 10,
      date: new Date(),
      category: getMockCategory(),
      reward: Math.random() > 0.5 ? Math.random() * 10 : undefined,
    };

    // Set the new transaction ID for animation
    setNewTransactionId(newTransaction.id);

    // Animate the new transaction
    animatedValue.setValue(0);
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();

    setTransactions([newTransaction, ...transactions]);
  };

  const handleTransactionPress = (transaction: Transaction) => {
    Haptics.selectionAsync();
    // TODO: Navigate to transaction detail
    console.log('Transaction details:', transaction);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Card</Text>
      </View>

      <Pressable onPress={handleCardTap} style={({ pressed }) => [styles.cardContainer, { opacity: pressed ? 0.9 : 1 }]}>
        <View style={styles.card}>
          <Text style={styles.visaLogo}>VISA</Text>
          <Text style={styles.cardBrand}>GlobeTrotter+</Text>
        </View>
        <Text style={styles.tapHint}>Tap card to make a payment</Text>
      </Pressable>

      <View style={styles.transactionsHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <Text style={styles.transactionsCount}>{transactions.length}</Text>
      </View>

      {/* Transactions */}
      <View style={styles.transactionsList}>
        {transactions.map((transaction) => {
          const isNew = transaction.id === newTransactionId;
          return (
            <Animated.View
              key={transaction.id}
              style={[
                isNew && {
                  transform: [
                    {
                      translateY: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-30, 0],
                      }),
                    },
                  ],
                  opacity: animatedValue,
                },
              ]}
            >
              <Pressable
                onPress={() => handleTransactionPress(transaction)}
                style={({ pressed }) => [
                  styles.transactionCard,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <View style={styles.transactionTop}>
                  <View style={styles.transactionLeft}>
                    <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(transaction.category) }]}>
                      <Text style={styles.categoryEmoji}>{getCategoryEmoji(transaction.category)}</Text>
                    </View>
                    <View style={styles.transactionDetails}>
                      <Text style={styles.merchantName}>{transaction.merchant}</Text>
                      <Text style={styles.categoryText}>{transaction.category}</Text>
                    </View>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={styles.transactionAmount}>-${transaction.amount.toFixed(2)}</Text>
                    <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
                  </View>
                </View>
                {transaction.reward && (
                  <View style={styles.rewardBanner}>
                    <Text style={styles.rewardIcon}>💰</Text>
                    <Text style={styles.rewardText}>+${transaction.reward.toFixed(2)} USDC reward earned</Text>
                  </View>
                )}
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function getMockMerchant(): string {
  const merchants = ['Tokyo Ramen House', 'Paris Bistro', 'London Coffee Shop', 'NY Museum', 'Singapore Airlines', 'Dubai Mall'];
  return merchants[Math.floor(Math.random() * merchants.length)];
}

function getMockCategory(): string {
  const categories = ['Dining', 'Travel', 'Shopping', 'Entertainment', 'Transport'];
  return categories[Math.floor(Math.random() * categories.length)];
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    'Dining': '🍽️',
    'Travel': '✈️',
    'Shopping': '🛍️',
    'Entertainment': '🎭',
    'Transport': '🚗',
  };
  return emojis[category] || '💳';
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Dining': '#FEF3C7',
    'Transport': '#DBEAFE',
    'Travel': '#E0E7FF',
    'Shopping': '#FCE7F3',
    'Entertainment': '#F3E8FF',
  };
  return colors[category] || '#F3F4F6';
}

function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

const styles = StyleSheet.create({
  container: { 
    paddingHorizontal: 16, 
    backgroundColor: '#FAFAF8',
    paddingBottom: 16,
  },
  topBar: {
    paddingBottom: 16,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'Kugile',
  },
  cardContainer: {
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#000000',
    borderRadius: 20,
    padding: 28,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
    position: 'relative',
  },
  visaLogo: {
    position: 'absolute',
    top: 24,
    right: 28,
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'system font',
    letterSpacing: 2,
  },
  cardBrand: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Kugile',
    letterSpacing: 1,
  },
  tapHint: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: 'system font',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'system font',
  },
  transactionsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontFamily: 'system font',
  },
  transactionsList: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E2DC',
    shadowColor: '#0B0F14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  transactionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryEmoji: {
    fontSize: 24,
  },
  transactionDetails: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B0F14',
    fontFamily: 'system font',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'system font',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B0F14',
    fontFamily: 'system font',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'system font',
  },
  rewardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  rewardIcon: {
    fontSize: 16,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16A34A',
    fontFamily: 'system font',
  },
});


