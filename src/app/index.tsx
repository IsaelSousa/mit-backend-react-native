import Label from '@/src/components/label';
import ListActionsButtons from '@/src/components/list_actions_buttons';
import Screen from '@/src/components/ui/screen';
import { addLocation, selectLocations } from "@/src/store/reducers/locationSlice";
import { useQuery } from '@apollo/client/react';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'toastify-react-native';
import { Button, ButtonIcon } from '../components/ui/button';
import { CloseIcon } from '../components/ui/icon';
import { sendLocalNotification } from '../hooks/useLocaleNotification';
import { useLocation } from '../hooks/useLocation';
import { GET_COUNTRY_INFORMATION } from '../services/queries/country/city';

export default function HomePage() {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const mapRef = useRef<MapView>(null);

    const dispatch = useDispatch();

    const [region, setRegion] = useState<Region>({
        latitude: -23.55052,
        longitude: -46.633308,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const [portalEnabled, setPortalEnabled] = useState<boolean>(false);
    const handleClose = () => setPortalEnabled(false);

    const locations = useSelector(selectLocations);

    const { queryResult } = useLocation();

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
        const { data, refetch } = queryResult;

        refetch();

        if (data && data.location.length > 0) {
            dispatch(addLocation(data.location));

            const lastItem = data.location[data.location.length - 1];
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
    };

    const {
        data
    } = useQuery(GET_COUNTRY_INFORMATION);

    // async function sendPushNotification(expoPushToken: string, title?: string, body?: string) {
    //     const message = {
    //         to: expoPushToken,
    //         sound: 'default',
    //         title: title || 'Original Title',
    //         body: body || 'And here is the body!',
    //     };

    //     await fetch('https://exp.host/--/api/v2/push/send', {
    //         method: 'POST',
    //         headers: {
    //             Accept: 'application/json',
    //             'Accept-encoding': 'gzip, deflate',
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(message),
    //     });
    // }

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

    useEffect(() => {
        handleRefreshLocations();
    }, [locations]);

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
            {locations.map((marker, index) => (
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
            },
            {
                icon: <FontAwesome name="cloud" size={24} color={colorScheme === 'dark' ? '#ffffff' : '#000000'} />,
                // onPress: () => sendPushNotification("ExponentPushToken[XBPW0_KY1zvWYCQYOhuw4-]")
                onPress: () => sendLocalNotification("Hello!", "This is a local notification.")
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