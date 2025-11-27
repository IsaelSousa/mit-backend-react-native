import { EditIcon, Icon, TrashIcon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getItem, setItem } from "@/utils/AsyncStorage";
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { Toast } from "toastify-react-native";
import { AddLocationParams } from "./add_location";

export default function LocationsList() {
    const router = useRouter();

    const [markersList, setMarkersList] = useState<AddLocationParams[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const textColor = useThemeColor({}, 'text');

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
                            <Text>{item.name}</Text>
                            <Text className="text-gray-400">Lat: {item.latitude}</Text>
                            <Text className="text-gray-400">Lng: {item.longitude}</Text>
                        </View>
                        <View>
                            <Pressable
                                className="bg-gray-400 p-2 rounded mb-2"
                                onPress={() => router.push({ pathname: '/edit_location', params: { region: JSON.stringify(item) } })}>
                                <Icon as={EditIcon} color={textColor} size="xl" />
                            </Pressable>
                            <Pressable
                                className="bg-green-800 p-2 rounded mb-2"
                                onPress={() => {}}>
                                <Entypo name="image" size={24} color="white" />
                            </Pressable>
                            <Pressable
                                className="bg-red-400 p-2 rounded"
                                onPress={() => handleDeleteLocation(item.id)}>
                                <Icon as={TrashIcon} color={textColor} size="xl" />
                            </Pressable>
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
        backgroundColor: '#000000',
    },
    item: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        color: '#ffffff',
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