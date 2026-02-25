import { useState, useLayoutEffect, useRef } from 'react';
import { supportsLiquidGlass } from '@/src/theme/glass';

// Module-level flag: first focused tab gets immediate ready state
let initialPhase = true;

/**
 * Hook that returns `ready` — true when it's safe to render LiquidGlassView.
 *
 * LiquidGlassView can fail if its parent starts at opacity 0 during
 * NativeTabs screen transitions. This hook ensures the first focused
 * tab is ready synchronously, while other tabs wait 200ms after gaining focus.
 */
export function useDeferredLiquidGlass(isFocused: boolean): boolean {
  const [ready, setReady] = useState(false);
  const wasReady = useRef(false);

  // Not on iOS 26+ — always ready (no liquid glass to worry about)
  if (!supportsLiquidGlass()) return true;

  // Once ready, stay ready
  if (wasReady.current) return true;

  useLayoutEffect(() => {
    if (!isFocused) return;

    if (initialPhase) {
      // First focused tab — ready immediately (before paint)
      initialPhase = false;
      wasReady.current = true;
      setReady(true);
      return;
    }

    // Other tabs — wait 200ms after gaining focus
    const timer = setTimeout(() => {
      wasReady.current = true;
      setReady(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [isFocused]);

  return ready;
}
