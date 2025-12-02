import ColorPickerModal from "@/src/components/color_picker";
import { Button, ButtonText } from "@/src/components/ui/button";
import { DownloadIcon, Icon } from "@/src/components/ui/icon";
import { useColorScheme } from "@/src/hooks/use-color-scheme.web";
import { addNotification } from "@/src/store/reducers/notificationSlice";
import { getItem, setItem } from "@/src/utils/AsyncStorage";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Region } from "react-native-maps";
import uuid from "react-native-uuid";
import { useDispatch } from "react-redux";
import { Toast } from "toastify-react-native";

export interface AddLocationParams {
    id: string;
    latitude: number;
    longitude: number;
    name: string;
    color: string;
    imageBase64?: string;
}

export default function AddLocationPage() {
    const { region } = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const router = useRouter();

    const dispatch = useDispatch();

    const [openColorPicker, setOpenColorPicker] = useState<boolean>(false);
    const [regionState, setRegionState] = useState<AddLocationParams | null>(null);

    const handleSavePicker = () => {
        try {
            const getActualItems = getItem<AddLocationParams[]>('locations');

            getActualItems.then((items) => {
                const newItems = items ? [...items] : [];
                if (regionState) newItems.push(regionState);
                setItem('locations', newItems);
            });

            Toast.success('Location saved successfully!');
            dispatch(addNotification({
                id: uuid.v4().toString(),
                readed: false,
                text: "Okay! Your location has been saved successfully.",
                timestamp: new Date().toISOString()
            }));
            router.push('/');
        } catch (error) {
            Toast.error('Error saving location');
        }
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Permission to access media library is required!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            base64: true,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const base64String = result.assets[0].base64;
            if (typeof base64String === 'string') {
                setRegionState((prev) => prev ? { ...prev, imageBase64: base64String } : null);
            }
        } else {
            alert('You did not select any image.');
        }
    };

    useEffect(() => {
        const id = uuid.v4();
        if (region) {
            const data = JSON.parse(region as string) as Region;
            setRegionState({
                id,
                latitude: data.latitude,
                longitude: data.longitude,
                name: 'Default Name',
                color: '#ff0000',
            });
        }
    }, [region]);

    return <View style={style.container}>

        <ColorPickerModal
            open={openColorPicker}
            initialColor={regionState?.color}
            onComplete={(color) => {
                setRegionState((prev) => prev ? { ...prev, color: color.hex } : null);
                setOpenColorPicker(false);
            }}
            onClose={() => setOpenColorPicker(false)}
        />

        <TextInput
            style={[style.input, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}
            placeholder="Location Name" value={regionState?.name}
            placeholderTextColor={colorScheme === 'dark' ? '#888888' : '#aaaaaa'}
            onChangeText={(text) => setRegionState((prev) => prev ? { ...prev, name: text } : null)}
        />

        <View style={style.colorPickerContainer}>
            <TextInput
                style={[style.input, { color: colorScheme === 'dark' ? '#ffffff' : '#000000', width: '50%' }]}
                placeholder="Color" value={regionState?.color}
                placeholderTextColor={colorScheme === 'dark' ? '#888888' : '#aaaaaa'}
                onChangeText={(text) => setRegionState((prev) => prev ? { ...prev, color: text } : null)}
            />
            <TouchableOpacity onPress={() => setOpenColorPicker(true)} style={[style.colorPickerButton, { backgroundColor: regionState?.color || (colorScheme === 'dark' ? '#1d1d1d' : '#ffffff'), borderWidth: 1, borderColor: '#888888' }]}>
                <AntDesign name="bg-colors" size={24} color={colorScheme === 'dark' ? '#ffffff' : '#000000'} />
            </TouchableOpacity>
        </View>

        <TextInput
            style={[style.input, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}
            placeholder="Latitude" value={regionState?.latitude.toString()} editable={false}
            placeholderTextColor={colorScheme === 'dark' ? '#888888' : '#aaaaaa'}
        />

        <TextInput
            style={[style.input, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}
            placeholder="Longitude" value={regionState?.longitude.toString()} editable={false}
            placeholderTextColor={colorScheme === 'dark' ? '#888888' : '#aaaaaa'}
        />

        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Button className="mt-4" variant="solid" action="positive" size="md" onPress={handleSavePicker}>
                <ButtonText size="lg" className="p-2" style={{ color: colorScheme === 'dark' ? '#ffffff' : '#000000' }}>Save Location</ButtonText>
            </Button>

            <Button className="mt-4 ml-4" variant="solid" action="positive" size="md" onPress={pickImage}>
                <Icon as={DownloadIcon} size="xl" color={colorScheme === "dark" ? "#ffffff" : "#000000"} />
            </Button>
        </View>

        {regionState?.imageBase64 && (
            <View style={{ marginTop: 20, padding: 2, elevation: 8, backgroundColor: '#000' }}>
                <Image
                    source={{ uri: `data:image/jpeg;base64,${regionState.imageBase64}` }}
                    style={{ width: 300, height: 300 }}
                    resizeMode="cover"
                />
            </View>
        )}

    </View>;
}

const style = StyleSheet.create({
    container: { flex: 1, alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
    subTitle: { fontSize: 16, color: 'gray', marginTop: 10 },
    separator: { marginVertical: 5, height: 1, width: '80%' },
    input: { height: 50, borderColor: 'gray', borderWidth: 1, width: '80%', paddingHorizontal: 10, marginTop: 20, borderRadius: 5 },
    saveButton: { marginTop: 30, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#007AFF' },
    removeBUtton: { marginTop: 15, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#FF3B30' },
    colorPickerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    colorPickerButton: { width: '30%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 20 }
});