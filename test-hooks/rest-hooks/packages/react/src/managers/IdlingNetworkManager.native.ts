import { NetworkManager } from '@data-client/core';
import { InteractionManager } from 'react-native';

/** Can help prevent stuttering by waiting for idle for sideEffect free fetches */
export default class NativeIdlingNetworkManager extends NetworkManager {
  /** Calls the callback when client is not 'busy' with high priority interaction tasks
   *
   * Override for platform-specific implementations
   */
  protected idleCallback(
    callback: (...args: any[]) => void,
    options?: IdleRequestOptions,
  ) {
    InteractionManager.runAfterInteractions(callback);
    if (options?.timeout) {
      InteractionManager.setDeadline(options.timeout);
    }
  }
}
