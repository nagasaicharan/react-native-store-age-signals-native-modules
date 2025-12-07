import {
  getAndroidPlayAgeRangeStatus,
  requestIOSDeclaredAgeRange,
} from 'react-native-store-age-signals-native-modules';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useState } from 'react';

export default function App() {
  const [result, setResult] = useState<string>('');

  const checkAndroidAge = async () => {
    try {
      setResult('>> Checking Android Age...');
      const data = await getAndroidPlayAgeRangeStatus();
      setResult((prev) => prev + '\n' + JSON.stringify(data, null, 2));
    } catch (e: any) {
      setResult((prev) => prev + '\nError: ' + e.message);
    }
  };

  const checkIOSAge = async () => {
    try {
      setResult('>> Checking iOS Age (13, 17, 21)...');
      const data = await requestIOSDeclaredAgeRange(13, 17, 21);
      setResult((prev) => prev + '\n' + JSON.stringify(data, null, 2));
    } catch (e: any) {
      setResult((prev) => prev + '\nError: ' + e.message);
    }
  };

  const runMock = async (title: string, config: any) => {
    setResult(`>> Mocking ${title}...`);
    try {
      const data = await getAndroidPlayAgeRangeStatus(config);
      setResult((prev) => prev + '\n' + JSON.stringify(data, null, 2));
    } catch (e: any) {
      setResult((prev) => prev + '\nError: ' + e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Store Age Signals</Text>
          <Text style={styles.headerSubtitle}>Verification Demo</Text>
        </View>

        {Platform.OS === 'android' ? (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Live Status</Text>
              <Text style={styles.cardDescription}>
                Check real Google Play Age Signal on this device.
              </Text>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={checkAndroidAge}
              >
                <Text style={styles.buttonText}>Check Live Age</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionHeader}>Developer Mocks</Text>

            <View style={styles.card}>
              <View style={styles.grid}>
                <TouchableOpacity
                  style={[styles.button, styles.successButton, styles.gridItem]}
                  onPress={() =>
                    runMock('Verified', {
                      isMock: true,
                      mockStatus: 'OVER_AGE',
                    })
                  }
                >
                  <Text style={styles.buttonText}>Over 18</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.warningButton, styles.gridItem]}
                  onPress={() =>
                    runMock('Supervised', {
                      isMock: true,
                      mockStatus: 'UNDER_AGE',
                      mockAgeLower: 13,
                      mockAgeUpper: 17,
                    })
                  }
                >
                  <Text style={styles.buttonText}>13-17</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.grid, styles.gridSpacing]}>
                <TouchableOpacity
                  style={[styles.button, styles.dangerButton, styles.gridItem]}
                  onPress={() =>
                    runMock('Error', {
                      isMock: true,
                      mockErrorCode: -1,
                    })
                  }
                >
                  <Text style={styles.buttonText}>Error</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.neutralButton, styles.gridItem]}
                  onPress={() =>
                    runMock('Unknown', {
                      isMock: true,
                      mockStatus: 'UNKNOWN',
                    })
                  }
                >
                  <Text style={styles.buttonText}>Unknown</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>iOS Live Status</Text>
            <Text style={styles.cardDescription}>
              Request Declared Age Range (iOS 18+).
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={checkIOSAge}
            >
              <Text style={styles.buttonText}>Request Age (13, 17, 21)</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionHeader}>Result Log</Text>
        <TextInput
          style={styles.consoleOutput}
          multiline
          editable={false}
          value={result}
          placeholder="// Logs will appear here..."
          placeholderTextColor="#666"
        />

        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => setResult('')}
        >
          <Text style={styles.clearButtonText}>Clear Logs</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 24,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A202C',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#718096',
    marginTop: 4,
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#A0AEC0',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  primaryButton: {
    backgroundColor: '#3182CE', // Blue
  },
  successButton: {
    backgroundColor: '#38A169', // Green
  },
  warningButton: {
    backgroundColor: '#D69E2E', // Yellow/Orange
  },
  dangerButton: {
    backgroundColor: '#E53E3E', // Red
  },
  neutralButton: {
    backgroundColor: '#718096', // Grey
  },
  grid: {
    flexDirection: 'row',
    gap: 10,
  },
  gridItem: {
    flex: 1,
  },
  gridSpacing: {
    marginTop: 10,
  },
  consoleOutput: {
    backgroundColor: '#1A202C',
    color: '#48BB78',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    padding: 16,
    borderRadius: 12,
    height: 240,
    textAlignVertical: 'top',
  },
  clearButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  clearButtonText: {
    color: '#718096',
    fontSize: 12,
    fontWeight: '600',
  },
});
