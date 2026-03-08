import Purchases, {
  LOG_LEVEL,
  type PurchasesPackage,
  type CustomerInfo,
} from 'react-native-purchases';
import { Platform } from 'react-native';
import { useAuthStore } from '@/src/store/auth-store';

const REVENUECAT_IOS_KEY = 'appl_oEBYbSyaCrCchGgTgGBjYxPKKgV';
const REVENUECAT_ANDROID_KEY = 'goog_YOUR_ANDROID_KEY_HERE';

const ENTITLEMENT_PRO = 'pro';
const ENTITLEMENT_PRO_PLUS = 'pro_plus';
const ENTITLEMENT_LEGACY_PREMIUM = 'premium';

type SubscriptionTier = 'free' | 'pro' | 'pro_plus';

let isInitialized = false;

export async function initPurchases(userId?: string) {
  if (isInitialized) return;

  const apiKey = Platform.OS === 'ios' ? REVENUECAT_IOS_KEY : REVENUECAT_ANDROID_KEY;

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  Purchases.configure({ apiKey, appUserID: userId || undefined });
  isInitialized = true;
}

export interface TieredOfferings {
  proMonthly: PurchasesPackage | null;
  proAnnual: PurchasesPackage | null;
  proPlusMonthly: PurchasesPackage | null;
  proPlusAnnual: PurchasesPackage | null;
}

export async function getOfferings(): Promise<TieredOfferings | null> {
  try {
    const offerings = await Purchases.getOfferings();

    const proOffering = offerings.all['pro'] || null;
    const proPlusOffering = offerings.all['pro_plus'] || offerings.current || null;

    return {
      proMonthly: proOffering?.availablePackages.find((p) => p.packageType === 'MONTHLY') ?? null,
      proAnnual: proOffering?.availablePackages.find((p) => p.packageType === 'ANNUAL') ?? null,
      proPlusMonthly: proPlusOffering?.availablePackages.find((p) => p.packageType === 'MONTHLY') ?? null,
      proPlusAnnual: proPlusOffering?.availablePackages.find((p) => p.packageType === 'ANNUAL') ?? null,
    };
  } catch (e) {
    console.warn('Failed to get offerings:', e);
    return null;
  }
}

export async function purchasePackage(pkg: PurchasesPackage): Promise<SubscriptionTier | false> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return checkSubscriptionTier(customerInfo);
  } catch (e: any) {
    if (e.userCancelled) {
      return false;
    }
    throw e;
  }
}

export async function restorePurchases(): Promise<SubscriptionTier | false> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const tier = checkSubscriptionTier(customerInfo);
    return tier === 'free' ? false : tier;
  } catch (e) {
    console.warn('Restore failed:', e);
    return false;
  }
}

export async function checkSubscriptionStatus(): Promise<SubscriptionTier> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return checkSubscriptionTier(customerInfo);
  } catch (e) {
    console.warn('Failed to check status:', e);
    return 'free';
  }
}

function checkSubscriptionTier(customerInfo: CustomerInfo): SubscriptionTier {
  const active = customerInfo.entitlements.active;

  // Pro+ check (also treat legacy 'premium' as Pro+)
  if (active[ENTITLEMENT_PRO_PLUS] !== undefined || active[ENTITLEMENT_LEGACY_PREMIUM] !== undefined) {
    const store = useAuthStore.getState();
    store.setSubscriptionStatus('PRO_PLUS');
    // Pro+ annual includes all chapters + PDF
    store.setChapterUnlock(true);
    store.setPdfAccess(true);
    return 'pro_plus';
  }

  // Pro check
  if (active[ENTITLEMENT_PRO] !== undefined) {
    const { setSubscriptionStatus } = useAuthStore.getState();
    setSubscriptionStatus('PRO');
    return 'pro';
  }

  // Free
  const { setSubscriptionStatus } = useAuthStore.getState();
  setSubscriptionStatus('FREE');
  return 'free';
}

export async function purchaseHeartPack(): Promise<boolean> {
  try {
    const offerings = await Purchases.getOfferings();
    const heartPack = offerings.all['heart_pack']?.availablePackages[0];
    if (!heartPack) return false;
    const { customerInfo } = await Purchases.purchasePackage(heartPack);
    if (customerInfo) {
      const { useHeartsStore } = require('@/src/store/hearts-store');
      useHeartsStore.getState().addBonusHearts(10);
      return true;
    }
    return false;
  } catch (e: any) {
    if (e.userCancelled) return false;
    throw e;
  }
}

export async function purchasePdfAccess(): Promise<boolean> {
  try {
    const offerings = await Purchases.getOfferings();
    const pdfPkg = offerings.all['pdf_guide']?.availablePackages[0];
    if (!pdfPkg) return false;
    const { customerInfo } = await Purchases.purchasePackage(pdfPkg);
    if (customerInfo) {
      useAuthStore.getState().setPdfAccess(true);
      return true;
    }
    return false;
  } catch (e: any) {
    if (e.userCancelled) return false;
    throw e;
  }
}

export async function purchaseChapterUnlock(): Promise<boolean> {
  try {
    const offerings = await Purchases.getOfferings();
    const chapterPkg = offerings.all['unlock_chapters']?.availablePackages[0];
    if (!chapterPkg) return false;
    const { customerInfo } = await Purchases.purchasePackage(chapterPkg);
    if (customerInfo) {
      useAuthStore.getState().setChapterUnlock(true);
      return true;
    }
    return false;
  } catch (e: any) {
    if (e.userCancelled) return false;
    throw e;
  }
}

export async function purchasePdfAndChaptersBundle(): Promise<boolean> {
  try {
    const offerings = await Purchases.getOfferings();
    const bundlePkg = offerings.all['pdf_chapters_bundle']?.availablePackages[0];
    if (!bundlePkg) return false;
    const { customerInfo } = await Purchases.purchasePackage(bundlePkg);
    if (customerInfo) {
      useAuthStore.getState().setChapterUnlock(true);
      useAuthStore.getState().setPdfAccess(true);
      return true;
    }
    return false;
  } catch (e: any) {
    if (e.userCancelled) return false;
    throw e;
  }
}

export async function loginRevenueCat(userId: string) {
  try {
    await Purchases.logIn(userId);
  } catch (e) {
    console.warn('RevenueCat login failed:', e);
  }
}

export async function logoutRevenueCat() {
  try {
    await Purchases.logOut();
  } catch (e) {
    console.warn('RevenueCat logout failed:', e);
  }
}
