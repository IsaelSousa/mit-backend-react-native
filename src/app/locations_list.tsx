import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogContent,
    AlertDialogHeader
} from '@/src/components/ui/alert-dialog';
import { EditIcon, Icon, TrashIcon } from "@/src/components/ui/icon";
import { Pressable } from "@/src/components/ui/pressable";
import { Text } from "@/src/components/ui/text";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { Toast } from "toastify-react-native";
import { useLocation } from '../hooks/useLocation';
import { LocationData } from '../services/queries/country/location';

export default function LocationsList() {
    const router = useRouter();

    const [markersList, setMarkersList] = useState<LocationData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const textColor = useThemeColor({}, 'text');
    const { getData, updateData, createData, deleteData } = useLocation();

    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [base64Image, setBase64Image] = useState<string>('');

    const handleClose = () => {
        setDialogVisible(false);
    };

    const handleGetLocations = async () => {
        setLoading(true);
        const { data } = getData();
        if (data && data.location) {
            setMarkersList(data.location);
            setLoading(false);
        }
    };

    const handleOpenImageDialog = (base64: string) => {
        if (base64) {
            setBase64Image(base64);
            setDialogVisible(true);
        }
    };

    const handleDeleteLocation = (id: string) => {
        try {
            setLoading(true);
            const { loading } = deleteData(id);
            if (!loading) {
                const { data } = getData();
                if (data && data.location) {
                    setMarkersList(data.location);
                    setLoading(false);
                    Toast.success('Location deleted successfully!');
                }
            }


        } catch (error) {
            Toast.error('Error fetching locations');
        }
    };

    useEffect(() => {
        handleGetLocations();
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: useThemeColor({}, 'background') }]}>
            <AlertDialog isOpen={dialogVisible} onClose={handleClose} size="md">
                <AlertDialogBackdrop />
                <AlertDialogContent style={{ alignItems: 'center', padding: 20 }}>
                    <AlertDialogHeader>
                        <Text className="text-lg font-bold mb-4" style={{ color: textColor }}>Location Image</Text>
                    </AlertDialogHeader>
                    <Image
                        source={{ uri: `data:image/jpeg;base64,${base64Image}` }}
                        style={{ width: 200, height: 200 }}
                        resizeMode="cover"
                    />
                </AlertDialogContent>
            </AlertDialog>
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
                                onPress={() => handleOpenImageDialog(item.imageBase64 || '')}>
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
        alignItems: 'center',
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