import Purchases, {
  LOG_LEVEL,
  type PurchasesPackage,
  type CustomerInfo,
} from 'react-native-purchases';
import { Platform } from 'react-native';
import { useAuthStore } from '@/src/store/auth-store';

// RevenueCat API keys — replace with your actual keys
const REVENUECAT_IOS_KEY = 'appl_YOUR_IOS_KEY_HERE';
const REVENUECAT_ANDROID_KEY = 'goog_YOUR_ANDROID_KEY_HERE';

const ENTITLEMENT_ID = 'premium';

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

export async function getOfferings() {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current) {
      return {
        monthly: offerings.current.availablePackages.find(
          (p) => p.packageType === 'MONTHLY'
        ),
        annual: offerings.current.availablePackages.find(
          (p) => p.packageType === 'ANNUAL'
        ),
        allPackages: offerings.current.availablePackages,
      };
    }
    return null;
  } catch (e) {
    console.warn('Failed to get offerings:', e);
    return null;
  }
}

export async function purchasePackage(pkg: PurchasesPackage): Promise<boolean> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return checkPremiumStatus(customerInfo);
  } catch (e: any) {
    if (e.userCancelled) {
      return false;
    }
    throw e;
  }
}

export async function restorePurchases(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return checkPremiumStatus(customerInfo);
  } catch (e) {
    console.warn('Restore failed:', e);
    return false;
  }
}

export async function checkSubscriptionStatus(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return checkPremiumStatus(customerInfo);
  } catch (e) {
    console.warn('Failed to check status:', e);
    return false;
  }
}

function checkPremiumStatus(customerInfo: CustomerInfo): boolean {
  const isPremium =
    customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

  // Update the auth store
  const { setSubscriptionStatus } = useAuthStore.getState();
  setSubscriptionStatus(isPremium ? 'PREMIUM' : 'FREE');

  return isPremium;
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
