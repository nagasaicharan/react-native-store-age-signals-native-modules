import {
  getAndroidPlayAgeRangeStatus,
  requestIOSDeclaredAgeRange,
} from 'react-native-store-age-signals-native-modules';
import {
  Text,
  View,
  StyleSheet,
  Button,
  Platform,
  TextInput,
} from 'react-native';
import { useState } from 'react';

export default function App() {
  const [result, setResult] = useState<string>('');

  const checkAndroidAge = async () => {
    try {
      setResult('Checking Android Age...');
      const data = await getAndroidPlayAgeRangeStatus();
      setResult(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setResult('Error: ' + e.message);
    }
  };

  const checkIOSAge = async () => {
    try {
      setResult('Checking iOS Age (13, 17, 21)...');
      const data = await requestIOSDeclaredAgeRange(13, 17, 21);
      setResult(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setResult('Error: ' + e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Age Signals Example</Text>

      {Platform.OS === 'android' && (
        <View style={styles.actions}>
          <Text style={styles.sectionTitle}>Real API</Text>
          <Button title="Check Live Age Status" onPress={checkAndroidAge} />

          <View style={styles.spacer20} />
          <Text style={styles.sectionTitle}>Mock Scenarios</Text>

          <Button
            title="Mock: Verified (Over 18)"
            color="#2ecc71"
            onPress={async () => {
              setResult('Mocking Verified...');
              const data = await getAndroidPlayAgeRangeStatus({
                isMock: true,
                mockStatus: 'OVER_AGE',
              });
              setResult(JSON.stringify(data, null, 2));
            }}
          />
          <View style={styles.spacer10} />
          <Button
            title="Mock: Supervised (13-17)"
            color="#f1c40f"
            onPress={async () => {
              setResult('Mocking Supervised (13-17)...');
              const data = await getAndroidPlayAgeRangeStatus({
                isMock: true,
                mockStatus: 'UNDER_AGE',
                mockAgeLower: 13,
                mockAgeUpper: 17,
              });
              setResult(JSON.stringify(data, null, 2));
            }}
          />
          <View style={styles.spacer10} />
          <Button
            title="Mock: Error (API Unavailable -1)"
            color="#e74c3c"
            onPress={async () => {
              setResult('Mocking Error...');
              const data = await getAndroidPlayAgeRangeStatus({
                isMock: true,
                mockErrorCode: -1,
              });
              setResult(JSON.stringify(data, null, 2));
            }}
          />
          <View style={styles.spacer10} />
          <Button
            title="Mock: Unknown"
            color="#95a5a6"
            onPress={async () => {
              setResult('Mocking Unknown...');
              const data = await getAndroidPlayAgeRangeStatus({
                isMock: true,
                mockStatus: 'UNKNOWN',
              });
              setResult(JSON.stringify(data, null, 2));
            }}
          />
        </View>
      )}

      {Platform.OS === 'ios' && (
        <Button title="Request iOS Declared Age" onPress={checkIOSAge} />
      )}

      <TextInput
        style={styles.resultInput}
        multiline
        editable={false}
        value={result}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  resultInput: {
    marginTop: 20,
    fontSize: 14,
    color: '#333',
    width: '100%',
    height: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    textAlignVertical: 'top',
  },
  actions: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#666',
  },
  spacer10: {
    height: 10,
  },
  spacer20: {
    height: 20,
  },
});
