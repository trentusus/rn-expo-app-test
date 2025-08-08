import React, { useEffect, useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import {
  useExperiment,
  useStatsigUser
} from '@statsig/react-native-bindings';
import { getUserPersistentOverrideAdapter } from '../utils/persistedUserAdapter';

export function StatsigExample() {
  const [qualifyingScore, setQualifyingScore] = useState(0);
  const [inputQualifyingScore, setInputQualifyingScore] = useState('');
  const { user, updateUserAsync } = useStatsigUser();

  // Use the singleton adapter instead of creating a new one
  const overrideAdapter = useMemo(() => {
    return getUserPersistentOverrideAdapter();
  }, []);

  // Load persisted values for the current user
  const userPersistedValues = overrideAdapter.loadUserPersistedValues(
    { userID: user.userID },
    'userID',
  );

  // Load qualifying score from persisted storage on component mount
  useEffect(() => {
    if (user.userID) {
      try {
        const persistedData = overrideAdapter.storage.load('userID');
        const userData = persistedData[user.userID] as any;
        if (userData && userData.qualifyingScore) {
          setQualifyingScore(userData.qualifyingScore);
          setInputQualifyingScore(userData.qualifyingScore.toString());
        }
      } catch (error) {
        console.log('Error loading persisted qualifying score:', error);
      }
    }
  }, [user.userID, overrideAdapter]);

  const experiment = useExperiment('an_experiment', { userPersistedValues });

  // Helper function to check if user is in experiment
  const isUserInExperiment = () => {
    return experiment.value && 
           Object.keys(experiment.value).length > 0 && 
           experiment.details.reason !== 'Default';
  };

  // Helper function to check if experiment has valid value
  const hasExperimentValue = () => {
    return experiment.value && Object.keys(experiment.value).length > 0;
  };

  const handleUpdateQualifyingScore = async (newQualifyingScore: number) => {
    
    // Update the Statsig user with new qualifying score
    await updateUserAsync((prev) => ({ 
      ...prev, 
      custom: { ...prev.custom, qualifyingScore: newQualifyingScore }
    }));

    // Save user data to persisted storage using the storage directly
    const userData = {
      userID: user.userID,
      qualifyingScore: newQualifyingScore,
      lastUpdated: new Date().toISOString()
    };
    
    // Save to persisted storage using the storage directly
    if (user.userID) {
      overrideAdapter.storage.save(
        'userID',
        user.userID,
        JSON.stringify(userData)
      );
    }

    setQualifyingScore(newQualifyingScore);

  };

  // Get all persisted data for debugging
  const allPersistedData = overrideAdapter.storage.load('userID');

  const clearPersistedData = () => {
    if (user.userID) {
      overrideAdapter.storage.delete('userID', user.userID);
      setQualifyingScore(72); // Reset to default
      setInputQualifyingScore('72');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statsig + MMKV User Persisted Storage</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User</Text>
        <Text style={styles.value}>Statsig UserID: {user.userID}</Text>
        <Text style={styles.value}>Qualifying Score: {qualifyingScore}</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Update Qualifying Score:</Text>
          <TextInput
            style={styles.textInput}
            value={inputQualifyingScore}
            onChangeText={setInputQualifyingScore}
            keyboardType="numeric"
            placeholder="Enter qualifying score"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const newQualifyingScore = parseInt(inputQualifyingScore) || 0;
              if (newQualifyingScore > 0) {
                handleUpdateQualifyingScore(newQualifyingScore);
              }
            }}
          >
            <Text style={styles.buttonText}>Set Qualifying Score</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF3B30', marginTop: 8 }]}
          onPress={clearPersistedData}
        >
          <Text style={styles.buttonText}>Clear Persisted Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experiment Status</Text>
        <View style={styles.item}>
          <Text style={styles.label}>Is User In Experiment:</Text>
          <Text style={styles.value}>
            {isUserInExperiment() ? '✅ Yes' : '❌ No'}
          </Text>
          <Text style={styles.reason}>
            {isUserInExperiment() 
              ? 'User is actively participating in the experiment'
              : 'User is not in the experiment or using default values'
            }
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Experiment Value:</Text>
          <Text style={styles.value}>
            {hasExperimentValue() ? JSON.stringify(experiment.value, null, 2) : 'No value (empty object {})'}
          </Text>
          <Text style={styles.reason}>Reason: {experiment.details.reason}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Debug (Persisted Storage)</Text>
        <ScrollView style={styles.debugBox}>
          <Text style={styles.mono}>All Persisted Data:</Text>
          <Text style={styles.mono}>{JSON.stringify(allPersistedData, null, 2)}</Text>
          <Text style={[styles.mono, { marginTop: 8 }]}>Current User Persisted Values:</Text>
          <Text style={styles.mono}>{JSON.stringify(userPersistedValues, null, 2)}</Text>
          <Text style={[styles.mono, { marginTop: 8 }]}>Current User Data (if exists):</Text>
          <Text style={styles.mono}>
            {user.userID && allPersistedData[user.userID] 
              ? JSON.stringify(allPersistedData[user.userID], null, 2)
              : 'No data found for current user'
            }
          </Text>
        </ScrollView>
        <Text style={styles.sectionTitle}>Experiment Details</Text>
        <ScrollView style={styles.debugBox}>
          <Text style={[styles.mono, { marginTop: 8 }]}>Experiment:</Text>
          <Text style={styles.mono}>{JSON.stringify(experiment, null, 2)}</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  item: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    marginBottom: 4,
  },
  reason: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    marginVertical: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    backgroundColor: 'white',
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  debugBox: {
    backgroundColor: '#111',
    color: '#fff',
    padding: 8,
    borderRadius: 4,
    maxHeight: 220,
  },
  mono: {
    fontFamily: Platform?.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#fff',
    fontSize: 12,
  },
});
