import { getItem, setItem } from "@/utils/AsyncStorage";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { Toast } from "toastify-react-native";
import { AddLocationParams } from "./add_location";

export default function LocationsList() {
    const router = useRouter();
    
    const [markersList, setMarkersList] = useState<AddLocationParams[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleGetLocations = async () => {
        setLoading(true);
        const storage = getItem<AddLocationParams[]>('locations');
        storage.then((items) => {
            if (items) setMarkersList(items);
            setLoading(false);
        });
    };

    const handleDeleteLocation = (id: string) => {
        try {
            setLoading(true);
            const storage = getItem<AddLocationParams[]>('locations');

            storage.then((items) => {
                if (items) {
                    const filteredItems = items.filter(item => item.id !== id);
                    setMarkersList(filteredItems);
                    setItem('locations', filteredItems);
                    setLoading(false);
                    Toast.success('Location deleted successfully!');
                }
            });

        } catch (error) {
            Toast.error('Error fetching locations');
        }
    };

    useEffect(() => {
        handleGetLocations();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                refreshControl={<RefreshControl refreshing={loading} onRefresh={handleGetLocations} />}
                data={markersList}
                renderItem={({ item, index }) => (
                    <View key={index} style={styles.item}>
                        <View>
                            <Text style={styles.text}>{item.name}</Text>
                            <Text style={styles.subTitle}>Lat: {item.latitude}</Text>
                            <Text style={styles.subTitle}>Lng: {item.longitude}</Text>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '/edit_location', params: { region: JSON.stringify(item) } })}>
                                <Text style={{ color: 'blue' }}>
                                    <AntDesign name="edit" size={24} color="black" />
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => handleDeleteLocation(item.id)}>
                                <Text style={{ color: 'red' }}>
                                    <Entypo name="trash" size={24} color="black" />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    item: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 16,
    },
    subTitle: {
        fontSize: 16,
        color: 'gray',
        marginTop: 10
    },
    button: {
        backgroundColor: '#eee',
        padding: 12,
        borderRadius: 4,
        marginBottom: 3,
    },
});