import { useState, useEffect } from 'react';

// Define the shape of the battery status object
export interface BatteryState {
  isSupported: boolean; // Whether the Battery API is supported
  loading: boolean; // True while initially fetching battery status
  charging: boolean | null;
  level: number | null; // Battery level (0.0 to 1.0)
  chargingTime: number | null; // Time until fully charged (seconds), null if N/A or Infinity
  dischargingTime: number | null; // Time until empty (seconds), null if N/A or Infinity
  error: Error | null;
}

// Type definition for the Battery Manager object - may vary slightly across browsers
// Using 'any' as a fallback if specific types aren't globally available
interface BatteryManager extends EventTarget {
  readonly charging: boolean;
  readonly chargingTime: number;
  readonly dischargingTime: number;
  readonly level: number;
  onchargingchange: ((this: BatteryManager, ev: Event) => any) | null;
  onchargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
  ondischargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
  onlevelchange: ((this: BatteryManager, ev: Event) => any) | null;
}

// Extend Navigator interface to include getBattery if needed
declare global {
  interface Navigator {
    getBattery?(): Promise<BatteryManager>;
  }
}

const isBrowser = typeof window !== 'undefined';
const nav = isBrowser ? navigator : undefined;

/**
 * Tracks the device's battery status using the Battery Status API.
 *
 * @returns {BatteryState} An object containing the battery status details.
 */
export function useBatteryStatus(): BatteryState {
  const [state, setState] = useState<BatteryState>({
    isSupported: !!(isBrowser && nav?.getBattery),
    loading: true,
    charging: null,
    level: null,
    chargingTime: null,
    dischargingTime: null,
    error: null,
  });

  useEffect(() => {
    if (!nav?.getBattery) {
      setState((s) => ({
        ...s,
        loading: false,
        isSupported: false,
        error: new Error('Battery Status API not supported by this browser.'),
      }));
      return;
    }

    let batteryManager: BatteryManager | null = null;

    const updateBatteryState = () => {
      if (batteryManager) {
        setState({
          isSupported: true,
          loading: false,
          charging: batteryManager.charging,
          level: batteryManager.level,
          chargingTime:
            batteryManager.chargingTime === Infinity
              ? null
              : batteryManager.chargingTime,
          dischargingTime:
            batteryManager.dischargingTime === Infinity
              ? null
              : batteryManager.dischargingTime,
          error: null,
        });
      }
    };

    const setupListeners = (manager: BatteryManager) => {
      manager.addEventListener('chargingchange', updateBatteryState);
      manager.addEventListener('levelchange', updateBatteryState);
      manager.addEventListener('chargingtimechange', updateBatteryState);
      manager.addEventListener('dischargingtimechange', updateBatteryState);
    };

    const removeListeners = (manager: BatteryManager | null) => {
      if (manager) {
        manager.removeEventListener('chargingchange', updateBatteryState);
        manager.removeEventListener('levelchange', updateBatteryState);
        manager.removeEventListener('chargingtimechange', updateBatteryState);
        manager.removeEventListener(
          'dischargingtimechange',
          updateBatteryState
        );
      }
    };

    nav
      .getBattery()
      .then((manager) => {
        batteryManager = manager;
        updateBatteryState();
        setupListeners(manager);
      })
      .catch((err) => {
        setState((s) => ({
          ...s,
          loading: false,
          error:
            err instanceof Error
              ? err
              : new Error('Failed to get battery status'),
        }));
      });

    return () => {
      // Pass the manager instance captured at the time of effect setup
      removeListeners(batteryManager);
    };
  }, []); // Run only on mount

  return state;
}
