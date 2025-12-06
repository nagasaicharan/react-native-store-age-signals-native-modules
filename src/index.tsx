import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-store-age-signals-native-modules' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const StoreAgeSignalsNativeModules = NativeModules.StoreAgeSignalsNativeModules
  ? NativeModules.StoreAgeSignalsNativeModules
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

// Android Types
export interface PlayAgeRangeStatusResult {
  installId: string | null;
  userStatus: 'OVER_AGE' | 'UNDER_AGE' | 'UNKNOWN' | null;
  error: string | null;
  /**
   * The (inclusive) lower bound of a supervised user's age range.
   * 0 to 18.
   */
  ageLower?: number | null;
  /**
   * The (inclusive) upper bound of a supervised user's age range.
   * 2 to 18.
   */
  ageUpper?: number | null;
  /**
   * The effective from date of the most recent significant change that was approved.
   * ISO string format.
   */
  mostRecentApprovalDate?: string | null;
  /**
   * The numerical error code if the request failed.
   * e.g., -1 (API_NOT_AVAILABLE), -2 (PLAY_STORE_NOT_FOUND), etc.
   */
  errorCode?: number | null;
}

// iOS Types
export interface DeclaredAgeRangeResult {
  status: 'sharing' | 'declined' | null;
  parentControls: string | null;
  lowerBound: number | null;
  upperBound: number | null;
}

export interface AndroidAgeRangeConfig {
  /**
   * Enable mock mode to simulate results without calling Google Play API.
   * Useful for development and testing.
   */
  isMock?: boolean;
  /**
   * The status to return when isMock is true.
   * Default: 'OVER_AGE'
   */
  mockStatus?: 'OVER_AGE' | 'UNDER_AGE' | 'UNKNOWN';
  /**
   * (Mock Only) Lower bound of the age range (e.g. 13).
   * Relevant when mockStatus is 'UNDER_AGE' (Supervised).
   */
  mockAgeLower?: number;
  /**
   * (Mock Only) Upper bound of the age range (e.g. 17).
   * Relevant when mockStatus is 'UNDER_AGE' (Supervised).
   */
  mockAgeUpper?: number;
  /**
   * (Mock Only) The numerical error code to throw.
   * e.g., -1 for API_NOT_AVAILABLE.
   */
  mockErrorCode?: number;
  /**
   * (Mock Only) ISO date string for most recent approval.
   */
  mockMostRecentApprovalDate?: string;
}

/**
 * Retrieves the age range declaration status from Google Play's Age Signals API.
 * @platform android
 */
export function getAndroidPlayAgeRangeStatus(
  config?: AndroidAgeRangeConfig
): Promise<PlayAgeRangeStatusResult> {
  if (Platform.OS !== 'android') {
    return Promise.resolve({
      installId: null,
      userStatus: null,
      error: 'This method is only available on Android',
    });
  }
  return StoreAgeSignalsNativeModules.getAndroidPlayAgeRangeStatus(
    config || {}
  );
}

/**
 * Requests age range declaration from iOS Declared Age Range API.
 * @platform ios
 * @param firstThresholdAge First age threshold (e.g., 13)
 * @param secondThresholdAge Second age threshold (e.g., 17)
 * @param thirdThresholdAge Third age threshold (e.g., 21)
 */
export function requestIOSDeclaredAgeRange(
  firstThresholdAge: number,
  secondThresholdAge: number,
  thirdThresholdAge: number
): Promise<DeclaredAgeRangeResult> {
  if (Platform.OS !== 'ios') {
    return Promise.resolve({
      status: null,
      parentControls: null,
      lowerBound: null,
      upperBound: null,
    });
  }
  return StoreAgeSignalsNativeModules.requestIOSDeclaredAgeRange(
    firstThresholdAge,
    secondThresholdAge,
    thirdThresholdAge
  );
}
