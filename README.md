# React Native Statsig Client Persistent Assignment Example

This is a React Native Expo app that demonstrates how to implement **Client Persistent Assignment** with Statsig. The app shows how users can be assigned to experiments based on their qualifying score and remain in that experiment even if targeting rules change.

## What is Client Persistent Assignment?

Client Persistent Assignment ensures that once a user is assigned to an experiment variant, they stay in that variant for the duration of the experiment, regardless of changes to allocation or targeting rules. This provides consistent user experience and reliable A/B test results.

For more information, see the [Statsig Client Persistent Assignment documentation](https://docs.statsig.com/client/concepts/persistent_assignment/).

## Prerequisites

Before running this app, you need:

1. **A Statsig Account**: Sign up at [statsig.com](https://statsig.com)
2. **A Client Key**: Create a client key in your Statsig console
3. **An Experiment**: Create an experiment named `an_experiment` with targeting rules

## Setup Instructions

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

**Note**: The `--legacy-peer-deps` flag is required due to dependency conflicts.

### 2. Create Statsig Experiment

In your Statsig console, create an experiment with the following settings:

- **Experiment Name**: `an_experiment`
- **Targeting Rule**: Only users with `qualifyingScore` > 50 should be in the experiment
- **Groups**: Create at least two groups (e.g., "Control" and "Test")
- **Parameters**: Create at least one parameter with a different value for Control and Test

**Targeting Configuration**:
- Add a condition: `custom_field` → `qualifyingScore` → `greater than` → `50`

### 3. Update your Statsig client key in Layout.tsx

Replease this line in `_layout.tsx` with your key

`const STATSIG_SDK_KEY = 'YOUR_KEY_HERE';`

### 4. Start the App

```bash
npx expo start
```

In the output, you'll find options to open the app in a:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

Please do not use Expo Go as it is not compatible with this implementation of MMKV (used for persistent storage)

## How to Test Client Persistent Assignment

### 1. Initial Setup
1. Open the app and navigate to the "Statsig Example" tab
2. Set your qualifying score to a value above 50 (e.g., 75)
3. Check if you're in the experiment - you should see "✅ Yes" if your score is > 50

### 2. Test Persistence
1. Once you're in the experiment, change your qualifying score to below 50 (e.g., 25)
2. You should still see "✅ Yes" for "Is User In Experiment" - this demonstrates persistent assignment
3. The user remains in the experiment even though they no longer meet the targeting criteria

### 3. Clear Persistent Storage
1. Click "Clear Persisted Data" to reset the persistent storage
2. Your qualifying score will reset to 72
3. Check if you're still in the experiment - you should now see "❌ No" since the persistent assignment was cleared

## Key Features Demonstrated

- **Persistent Assignment**: Users stay in their assigned experiment variant
- **Targeting Rules**: Users are assigned based on their `qualifyingScore`
- **Persistent Storage**: Uses MMKV for on-device storage of experiment assignments
- **Environment Variables**: Secure configuration management
- **Real-time Updates**: Live experiment status and value display
