import { AppleMaps, GoogleMaps } from 'expo-maps';
import { Platform, StyleSheet, View } from 'react-native';

export default function MapScreen() {
  const region = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };
  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        <AppleMaps.View style={StyleSheet.absoluteFill} cameraPosition={{
          coordinates: { latitude: region.latitude, longitude: region.longitude },
          zoom: 11,
        }} />
      ) : (
        <GoogleMaps.View style={StyleSheet.absoluteFill} cameraPosition={{
          coordinates: { latitude: region.latitude, longitude: region.longitude },
          zoom: 11,
        }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});


