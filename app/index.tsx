import Label from '@/components/label';
import ListActionsButtons from '@/components/list_actions_buttons';
import Screen from '@/components/ui/screen';
import { getItem } from '@/utils/AsyncStorage';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
import { Toast } from 'toastify-react-native';
import { AddLocationParams } from './add_location';

export default function HomePage() {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const mapRef = useRef<MapView>(null);

    const [region, setRegion] = useState<Region>({
        latitude: -23.55052,
        longitude: -46.633308,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const [markersList, setMarkersList] = useState<AddLocationParams[]>([]);

    const handleMapPress = (event: MapPressEvent) => {
        const coord = event.nativeEvent.coordinate;
        setRegion({ latitude: coord.latitude, longitude: coord.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });
    };

    const navigateToAddLocation = (region: Region | undefined) => {
        if (region) {
            router.push({ pathname: '/add_location', params: { region: JSON.stringify(region) } });
        }
    };

    const handleRefreshLocations = () => {
        const storage = getItem<AddLocationParams[]>('locations');
        storage.then((items) => {
            if (items) {
                if (items.length === 0) return;

                setMarkersList(items);

                const lastItem = items[items.length - 1];
                const newRegion = {
                    latitude: lastItem.latitude,
                    longitude: lastItem.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };

                setRegion(newRegion);
                mapRef.current?.animateToRegion(newRegion, 1000);
                Toast.success('Locations refreshed successfully!');
            }
        });
    };

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Toast.error('Permission to access location was denied');
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const newRegion = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };

            setRegion(newRegion);
            mapRef.current?.animateToRegion(newRegion, 1000);
        })();
    }, []);

    useEffect(() => {
        handleRefreshLocations();
    }, []);

    useFocusEffect(
        useCallback(() => {
            setTimeout(() => {
                handleRefreshLocations();
            }, 1000);
        }, [])
    );

    return <Screen>
        <Label label="Map Locations" />
        <MapView
            style={{ flex: 1 }}
            onPress={handleMapPress}
            showsUserLocation
            followsUserLocation
            initialRegion={region}
            region={region}
        >
            <Marker coordinate={region} />
            {markersList.map((marker, index) => (
                <Marker key={index} coordinate={marker} pinColor={marker.color} />
            ))}
        </MapView>
        <ListActionsButtons listActions={[
            {
                icon: <Entypo name="plus" size={24} color={colorScheme === 'dark' ? '#ffffff' : '#000000'} />,
                onPress: () => navigateToAddLocation(region)
            },
            {
                icon: <FontAwesome name="refresh" size={24} color={colorScheme === 'dark' ? '#ffffff' : '#000000'} />,
                onPress: handleRefreshLocations
            },
            {
                icon: <FontAwesome name="list" size={24} color={colorScheme === 'dark' ? '#ffffff' : '#000000'} />,
                onPress: () => router.push('/locations_list')
            }
        ]}
        />
    </Screen>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        borderRadius: 56 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 30,
        right: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    fabText: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, width: 300, borderRadius: 5
    }
});