import React, { useEffect, useState } from 'react';
import { Button, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

export function MMKVTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const testMMKV = async () => {
      const results: string[] = [];
      
      try {
        results.push(`Platform: ${Platform.OS}`);
        results.push(`User Agent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}`);
        
        // Test if we can import MMKV
        let MMKV: any;
        try {
          MMKV = require('react-native-mmkv').MMKV;
          results.push('✅ MMKV import successful');
        } catch (importError) {
          results.push(`❌ MMKV import failed: ${importError instanceof Error ? importError.message : String(importError)}`);
          setIsSupported(false);
          setTestResults(results);
          return;
        }
        
        // Test MMKV instantiation
        let mmkv: any;
        try {
          mmkv = new MMKV({ id: 'test-storage' });
          results.push('✅ MMKV instantiation successful');
        } catch (instantiationError) {
          results.push(`❌ MMKV instantiation failed: ${instantiationError instanceof Error ? instantiationError.message : String(instantiationError)}`);
          setIsSupported(false);
          setTestResults(results);
          return;
        }
        
        // Test basic operations
        try {
          mmkv.set('test-key', 'test-value');
          const retrieved = mmkv.getString('test-key');
          results.push(`✅ Set/Get string: ${retrieved === 'test-value' ? 'PASS' : 'FAIL'}`);
        } catch (error) {
          results.push(`❌ String operations failed: ${error instanceof Error ? error.message : String(error)}`);
        }
        
        // Test JSON operations
        try {
          const testObj = { name: 'test', value: 123 };
          mmkv.set('test-obj', JSON.stringify(testObj));
          const retrievedObj = JSON.parse(mmkv.getString('test-obj') || '{}');
          results.push(`✅ Set/Get JSON: ${JSON.stringify(retrievedObj) === JSON.stringify(testObj) ? 'PASS' : 'FAIL'}`);
        } catch (error) {
          results.push(`❌ JSON operations failed: ${error instanceof Error ? error.message : String(error)}`);
        }
        
        // Test deletion
        try {
          mmkv.delete('test-key');
          const afterDelete = mmkv.getString('test-key');
          results.push(`✅ Delete operation: ${afterDelete === undefined ? 'PASS' : 'FAIL'}`);
        } catch (error) {
          results.push(`❌ Delete operation failed: ${error instanceof Error ? error.message : String(error)}`);
        }
        
        // Test contains
        try {
          mmkv.set('contains-test', 'value');
          const contains = mmkv.contains('contains-test');
          results.push(`✅ Contains check: ${contains ? 'PASS' : 'FAIL'}`);
        } catch (error) {
          results.push(`❌ Contains check failed: ${error instanceof Error ? error.message : String(error)}`);
        }
        
        // Test getAllKeys
        try {
          const allKeys = mmkv.getAllKeys();
          results.push(`✅ GetAllKeys: ${allKeys.length > 0 ? 'PASS' : 'FAIL'} (${allKeys.length} keys)`);
        } catch (error) {
          results.push(`❌ GetAllKeys failed: ${error instanceof Error ? error.message : String(error)}`);
        }
        
        setIsSupported(true);
        
      } catch (error) {
        results.push(`❌ General MMKV Error: ${error instanceof Error ? error.message : String(error)}`);
        setIsSupported(false);
      }
      
      setTestResults(results);
    };

    testMMKV();
  }, []);

  const runAdditionalTests = async () => {
    const results = [...testResults];
    
    try {
      const MMKV = require('react-native-mmkv').MMKV;
      const mmkv = new MMKV({ id: 'additional-test-storage' });
      
      // Test number storage
      try {
        mmkv.set('test-number', 42);
        const retrievedNumber = mmkv.getNumber('test-number');
        results.push(`✅ Number storage: ${retrievedNumber === 42 ? 'PASS' : 'FAIL'}`);
      } catch (error) {
        results.push(`❌ Number storage failed: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Test boolean storage
      try {
        mmkv.set('test-bool', true);
        const retrievedBool = mmkv.getBoolean('test-bool');
        results.push(`✅ Boolean storage: ${retrievedBool === true ? 'PASS' : 'FAIL'}`);
      } catch (error) {
        results.push(`❌ Boolean storage failed: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Test array storage
      try {
        const testArray = [1, 2, 3, 'test'];
        mmkv.set('test-array', JSON.stringify(testArray));
        const retrievedArray = JSON.parse(mmkv.getString('test-array') || '[]');
        results.push(`✅ Array storage: ${JSON.stringify(retrievedArray) === JSON.stringify(testArray) ? 'PASS' : 'FAIL'}`);
      } catch (error) {
        results.push(`❌ Array storage failed: ${error instanceof Error ? error.message : String(error)}`);
      }
      
    } catch (error) {
      results.push(`❌ Additional test error: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    setTestResults(results);
  };

  const clearStorage = async () => {
    const results = [...testResults];
    
    try {
      const MMKV = require('react-native-mmkv').MMKV;
      const mmkv = new MMKV({ id: 'test-storage' });
      mmkv.clearAll();
      results.push('✅ Storage cleared');
    } catch (error) {
      results.push(`❌ Clear error: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    setTestResults(results);
  };

  const testLocalStorage = () => {
    const results = [...testResults];
    
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('test-key', 'test-value');
        const retrieved = localStorage.getItem('test-key');
        results.push(`✅ localStorage Set/Get: ${retrieved === 'test-value' ? 'PASS' : 'FAIL'}`);
        localStorage.removeItem('test-key');
      } else {
        results.push('❌ localStorage not available');
      }
    } catch (error) {
      results.push(`❌ localStorage test failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    setTestResults(results);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MMKV Web Compatibility Test</Text>
      
      <View style={styles.statusSection}>
        <Text style={styles.statusTitle}>Status:</Text>
        <Text style={[styles.status, isSupported === true ? styles.success : isSupported === false ? styles.error : styles.pending]}>
          {isSupported === true ? '✅ Supported' : isSupported === false ? '❌ Not Supported' : '⏳ Testing...'}
        </Text>
      </View>

      <ScrollView style={styles.resultsContainer}>
        <Text style={styles.sectionTitle}>Test Results:</Text>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            {result}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button title="Run Additional Tests" onPress={runAdditionalTests} />
        <Button title="Clear Storage" onPress={clearStorage} color="#ff6b6b" />
        <Button title="Test localStorage" onPress={testLocalStorage} color="#4ecdc4" />
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
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
  },
  success: {
    color: '#28a745',
  },
  error: {
    color: '#dc3545',
  },
  pending: {
    color: '#ffc107',
  },
  resultsContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 4,
    maxHeight: 300,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 12,
    fontFamily: Platform?.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 8,
  },
});
