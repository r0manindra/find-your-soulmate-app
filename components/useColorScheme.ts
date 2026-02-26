import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useSettingsStore } from '@/src/store/settings-store';

export function useColorScheme(): 'light' | 'dark' {
  const systemScheme = useSystemColorScheme();
  const themeMode = useSettingsStore((s) => s.themeMode);

  if (themeMode === 'system') {
    return systemScheme ?? 'light';
  }
  return themeMode;
}
