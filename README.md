# react-native-store-age-signals-native-modules

A React Native Native Module (Legacy Architecture) that provides access to store-level age signals, including Android Play Age Range and iOS Declared Age, to assist with state-level age verification compliance (e.g., Texas).

## Features

- **Android**: Integrates with Google Play Age Signals API.
- **iOS**: Integrates with Apple's `DeclaredAgeRange` framework (iOS 18+).

## Installation

```sh
npm install react-native-store-age-signals-native-modules
# or
yarn add react-native-store-age-signals-native-modules
```

### iOS Setup

1. Run `pod install` in your `ios` directory:
   ```sh
   cd ios && pod install
   ```
3. **Entitlements**: You must enable the "Declared Age Range" capability for your app.
    - Open your project in Xcode.
    - Select your App target -> "Signing & Capabilities".
    - Click "+ Capability" and add **Declared Age Range**.
    - This adds the `com.apple.developer.declared-age-range` entitlement key to your `.entitlements` file.
    *(Without this, the API will fail with "Error 0")*
    > **Note**: This capability may not be available for "Personal Team" (free) provisioning profiles. You likely need a paid Apple Developer Program membership to sign apps with this entitlement.

### Android Setup

This package automatically includes the `com.google.android.play:age-signals` dependency.
- **Requirements**: Google Play Services must be available on the device.

## Usage

```js
import { 
  getAndroidPlayAgeRangeStatus, 
  requestIOSDeclaredAgeRange 
} from 'react-native-store-age-signals-native-modules';
import { Platform } from 'react-native';

// Android: Check Play Age Range (Real)
async function checkAndroidAge() {
  if (Platform.OS !== 'android') return;

  const result = await getAndroidPlayAgeRangeStatus();
  
  if (result.userStatus === 'OVER_AGE') {
    console.log('User is verified adult');
  } else if (result.userStatus === 'UNDER_AGE') {
    console.log(`User is supervised. Range: ${result.ageLower}-${result.ageUpper}`);
  } else if (result.errorCode) {
     console.error(`API Error: ${result.errorCode}`);
  }
}

// Android: Mock Usage (Development/Testing)
async function checkMockAge() {
  // 1. Simulate Supervised User (13-17)
  const supervised = await getAndroidPlayAgeRangeStatus({
    isMock: true,
    mockStatus: 'UNDER_AGE',
    mockAgeLower: 13,
    mockAgeUpper: 17
  });

  // 2. Simulate API Error (e.g. Play Store outdated)
  const error = await getAndroidPlayAgeRangeStatus({
    isMock: true,
    mockErrorCode: -6 
  });
}

// iOS: Request Declared Age Range
async function checkIOSAge() {
  if (Platform.OS !== 'ios') return;

  // Define your age thresholds (e.g., 13, 17, 21)
  const result = await requestIOSDeclaredAgeRange(13, 17, 21);
  
  if (result.status === 'sharing') {
    console.log('Lower Bound:', result.lowerBound);
    console.log('Upper Bound:', result.upperBound);
  } else {
    console.log('Status:', result.status); // 'declined', 'unknown'
  }
}
```

## API Reference

### `getAndroidPlayAgeRangeStatus(config?)`
*(Android Only)*

Retrieves the age range declaration status from Google Play.

**Parameters:**
- `config`: Optional object
  - `isMock` (boolean): If `true`, uses the official `FakeAgeSignalsManager` for testing/simulation.
  - `mockStatus` ('OVER_AGE' | 'UNDER_AGE' | 'UNKNOWN'): Configures the `FakeAgeSignalsManager` response. Default: `'OVER_AGE'`.
  - `mockAgeLower` (number): (Mock Only) Lower bound of age range (e.g. 13). Relevant for `UNDER_AGE` (Supervised).
  - `mockAgeUpper` (number): (Mock Only) Upper bound of age range (e.g. 17). Relevant for `UNDER_AGE` (Supervised).
  - `mockErrorCode` (number): (Mock Only) Simulates an API error (e.g. -1).
  - `mockMostRecentApprovalDate` (string): (Mock Only) ISO date string.

Returns `Promise<PlayAgeRangeStatusResult>`:
- `userStatus`: `'OVER_AGE' | 'UNDER_AGE' | 'UNKNOWN' | null`
- `installId`: `string | null`
- `ageLower`: `number | null` (0-18, if supervised)
- `ageUpper`: `number | null` (2-18, if supervised)
- `mostRecentApprovalDate`: `string | null` (ISO date string, if available)
- `error`: `string | null`

### `requestIOSDeclaredAgeRange(first, second, third)`
*(iOS Only)*

Requests age range declaration from iOS 18+ Declared Age Range API.

**Parameters:**
- `firstThresholdAge` (number): e.g., 13
- `secondThresholdAge` (number): e.g., 17
- `thirdThresholdAge` (number): e.g., 21

Returns `Promise<DeclaredAgeRangeResult>`:
- `status`: `'sharing' | 'declined' | null`
- `parentControls`: `string | null`
- `lowerBound`: `number | null`
- `upperBound`: `number | null`


### Android Error Codes
*(Returned in `errorCode` for `getAndroidPlayAgeRangeStatus`)*

| Code | Error | Description | Retryable |
|---|---|---|---|
| -1 | API_NOT_AVAILABLE | Play Store app version might be old. | Yes |
| -2 | PLAY_STORE_NOT_FOUND | No Play Store app found. | Yes |
| -3 | NETWORK_ERROR | No network connection. | Yes |
| -4 | PLAY_SERVICES_NOT_FOUND | Play Services unavailable or old. | Yes |
| -5 | CANNOT_BIND_TO_SERVICE | Failed to bind to Play Store service. | Yes |
| -6 | PLAY_STORE_VERSION_OUTDATED | Play Store app needs update. | Yes |
| -7 | PLAY_SERVICES_VERSION_OUTDATED | Play Services needs update. | Yes |
| -8 | CLIENT_TRANSIENT_ERROR | Transient client error. Retry with backoff. | Yes |
| -9 | APP_NOT_OWNED | App not installed by Google Play. | No |
| -100 | INTERNAL_ERROR | Unknown internal error. | No |

### iOS Error Codes
*(Returned in promise rejection for `requestIOSDeclaredAgeRange`)*

| Code | Error | Description |
|---|---|---|
| 0 | IOS_ENTITLEMENT_ERROR | Missing Entitlement OR Feature unavailable on Simulator. Test on real device. |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
