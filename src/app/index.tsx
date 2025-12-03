import Label from '@/src/components/label';
import ListActionsButtons from '@/src/components/list_actions_buttons';
import Screen from '@/src/components/ui/screen';
import { getItem } from '@/src/utils/AsyncStorage';
import { useQuery } from '@apollo/client/react';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
import { Toast } from 'toastify-react-native';
import { Button, ButtonIcon } from '../components/ui/button';
import { CloseIcon } from '../components/ui/icon';
import { GET_COUNTRY_INFORMATION } from '../services/queries/country/city';
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

    const [portalEnabled, setPortalEnabled] = useState<boolean>(false);
    const [markersList, setMarkersList] = useState<AddLocationParams[]>([]);
    const handleClose = () => setPortalEnabled(false);

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

    const {
        data,
        loading,
        error
    } = useQuery(GET_COUNTRY_INFORMATION);

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

        <Modal visible={portalEnabled} onRequestClose={handleClose} animationType="slide" transparent={false}>
            <View style={{ flex: 1, justifyContent: 'center', borderColor: 'black', flexDirection: 'column' }}>
                <Button
                    size="xs"
                    className="h-6 px-1 absolute top-2 right-2"
                    variant="outline"
                    onPress={handleClose}
                >
                    <ButtonIcon as={CloseIcon} />
                </Button>

                <ScrollView>
                    {data?.countries.map(country => (
                        <TouchableOpacity 
                        style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }} 
                        onPress={() => {
                            setRegion({
                            latitude: country.defaultLatitude,
                            longitude: country.defaultLongitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        })
                        handleClose();
                        }}
                        key={country.id}>
                            <Text>{country.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </Modal>

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
            },
            {
                icon: <FontAwesome name="book" size={24} color={colorScheme === 'dark' ? '#ffffff' : '#000000'} />,
                onPress: () => setPortalEnabled(true)
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