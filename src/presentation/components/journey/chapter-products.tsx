import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '@/src/presentation/components/ui/glass-card';
import { useSettingsStore } from '@/src/store/settings-store';
import { getProductsForChapter } from '@/src/data/content/products';
import type { Product } from '@/src/core/entities/types';

interface ChapterProductsProps {
  chapterId: number;
}

export function ChapterProducts({ chapterId }: ChapterProductsProps) {
  const { t } = useTranslation();
  const locale = useSettingsStore((s) => s.locale) as 'en' | 'de';
  const products = getProductsForChapter(chapterId);
  const [expanded, setExpanded] = useState(false);

  if (products.length === 0) return null;

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpanded((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleToggle} style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="gift-outline" size={18} color="#E8435A" />
          <Text style={styles.headerTitle}>{t('products.title')}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{products.length}</Text>
          </View>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="#A3A3A3"
        />
      </Pressable>

      {expanded && (
        <Animated.View entering={FadeInDown.duration(300)}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} t={t} />
          ))}
          <Text style={styles.disclaimer}>{t('products.disclaimer')}</Text>
        </Animated.View>
      )}
    </View>
  );
}

function ProductCard({
  product,
  locale,
  t,
}: {
  product: Product;
  locale: 'en' | 'de';
  t: any;
}) {
  const [showWhy, setShowWhy] = useState(false);

  const handleViewProduct = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    WebBrowser.openBrowserAsync(product.affiliateUrl);
  };

  return (
    <GlassCard style={styles.productCard}>
      <View style={styles.productHeader}>
        <Text style={styles.productEmoji}>{product.emoji}</Text>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productBrand}>{product.brand}</Text>
        </View>
      </View>

      <Text style={styles.productDescription}>
        {product.description[locale]}
      </Text>

      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setShowWhy((prev) => !prev);
        }}
        style={styles.whyToggle}
      >
        <Text style={styles.whyToggleText}>{t('products.whyItWorks')}</Text>
        <Ionicons
          name={showWhy ? 'chevron-up' : 'chevron-down'}
          size={14}
          color="#737373"
        />
      </Pressable>

      {showWhy && (
        <Text style={styles.whyText}>{product.whyItWorks[locale]}</Text>
      )}

      <Pressable onPress={handleViewProduct} style={styles.viewButton}>
        <Ionicons name="open-outline" size={14} color="#E8435A" />
        <Text style={styles.viewButtonText}>{t('products.viewProduct')}</Text>
      </Pressable>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171717',
    letterSpacing: -0.2,
  },
  badge: {
    backgroundColor: 'rgba(232,67,90,0.1)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E8435A',
  },
  disclaimer: {
    fontSize: 11,
    color: '#A3A3A3',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  productCard: {
    marginBottom: 10,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  productEmoji: {
    fontSize: 28,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171717',
    letterSpacing: -0.2,
  },
  productBrand: {
    fontSize: 13,
    color: '#737373',
    marginTop: 1,
  },
  productDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#525252',
    marginBottom: 8,
  },
  whyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
  },
  whyToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#737373',
  },
  whyText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#737373',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(232,67,90,0.06)',
    marginTop: 4,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E8435A',
  },
});
