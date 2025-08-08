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

**Note**: The `--legacy-peer-deps` flag is required due to dependency conflicts with the Statsig React Native SDK.

### 2. Set up Environment Variables

Copy the example environment file and update it with your actual values:

```bash
cp .env.example .env
```

Update the `.env` file with your actual Statsig SDK key:
```
STATSIG_SDK_KEY=your_actual_statsig_client_key_here
```

### 3. Create Statsig Experiment

In your Statsig console, create an experiment with the following settings:

- **Experiment Name**: `an_experiment`
- **Targeting Rule**: Only users with `qualifyingScore` > 50 should be in the experiment
- **Groups**: Create at least two groups (e.g., "Control" and "Test")
- **Parameters**: Create at least one parameter with a different value for Control and Test

**Targeting Configuration**:
- Add a condition: `custom_field` → `qualifyingScore` → `greater than` → `50`

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

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Environment Variables

This project uses environment variables for configuration. The following variables are required:

- `STATSIG_SDK_KEY`: Your Statsig client SDK key

The environment variables are loaded from the `.env` file. Make sure to:
1. Copy `.env.example` to `.env`
2. Update the values in `.env` with your actual configuration
3. Never commit the `.env` file to version control (it's already in `.gitignore`)

## Technical Implementation

### Persistent Storage
This app uses MMKV (a high-performance key-value storage library) to persist experiment assignments locally on the device. The implementation follows the [Statsig Client Persistent Assignment pattern](https://docs.statsig.com/client/concepts/persistent_assignment/):

- **Storage Adapter**: Custom implementation using MMKV
- **User Persistence**: Experiment assignments are stored per user
- **Automatic Cleanup**: Expired experiments are automatically removed from storage

### Experiment Configuration
The experiment `an_experiment` is configured with:
- **Targeting**: Only users with `qualifyingScore` > 50
- **Persistence**: Once assigned, users remain in their variant
- **Groups**: Control and Test variants for A/B testing

## Troubleshooting

### Common Issues

1. **Installation fails**: Make sure to use `--legacy-peer-deps` flag
2. **Experiment not showing**: Verify your Statsig experiment is active and targeting rules are correct
3. **User not in experiment**: Check that your `qualifyingScore` is above 50
4. **Persistence not working**: Try clearing the app data or using the "Clear Persisted Data" button

### Debug Information

The app includes a debug section that shows:
- All persisted data
- Current user persisted values
- Experiment details and assignment reasons

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
- [Statsig Client Persistent Assignment](https://docs.statsig.com/client/concepts/persistent_assignment/): Official documentation for persistent assignment

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
