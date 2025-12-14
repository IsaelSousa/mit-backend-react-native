import ColorPickerModal from "@/src/components/color_picker";
import { Button, ButtonText } from "@/src/components/ui/button";
import { DownloadIcon, Icon } from "@/src/components/ui/icon";
import { useColorScheme } from "@/src/hooks/use-color-scheme.web";
import { addLocation } from "@/src/store/reducers/locationSlice";
import { addNotification } from "@/src/store/reducers/notificationSlice";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Region } from "react-native-maps";
import uuid from "react-native-uuid";
import { useDispatch } from "react-redux";
import { Toast } from "toastify-react-native";
import { useLocation } from "../hooks/useLocation";
import { AddLocationParams } from "../services/queries/country/location";

export default function AddLocationPage() {
    const { region } = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const router = useRouter();

    const { createData, queryResult } = useLocation();
    
    const dispatch = useDispatch();

    const [openColorPicker, setOpenColorPicker] = useState<boolean>(false);
    const [regionState, setRegionState] = useState<AddLocationParams>({
        name: '',
        latitude: 0,
        longitude: 0,
        color: '',
        imageBase64: ''
    });

    const handleSavePicker = async () => {
        try {
            const data = await createData(regionState);

            if (data != null && data.data != null && data.data.createLocation != null) {
                Toast.success('Location saved successfully!');
                dispatch(addNotification({
                    id: uuid.v4().toString(),
                    readed: false,
                    text: "Okay! Your location has been saved successfully.",
                    timestamp: new Date().toISOString()
                }));
                router.push('/');

                const dataResult = queryResult.data;

                if (dataResult) {
                    dispatch(addLocation(dataResult.location));
                    console.log('Dispatched addLocation with:', dataResult.location);
                }
                    
            }

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
                setRegionState((prev) => ({ ...prev, imageBase64: base64String }));
            }
        } else {
            alert('You did not select any image.');
        }
    };

    useEffect(() => {
        if (region) {
            const data = JSON.parse(region as string) as Region;
            setRegionState({
                latitude: data.latitude,
                longitude: data.longitude,
                name: 'Default Name',
                color: '#ff0000',
                imageBase64: ''
            });
        }
    }, [region]);

    return <View style={style.container}>

        <ColorPickerModal
            open={openColorPicker}
            initialColor={regionState?.color}
            onComplete={(color) => {
                setRegionState((prev) => ({ ...prev, color: color.hex }));
                setOpenColorPicker(false);
            }}
            onClose={() => setOpenColorPicker(false)}
        />

        <TextInput
            style={[style.input, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}
            placeholder="Location Name" value={regionState?.name}
            placeholderTextColor={colorScheme === 'dark' ? '#888888' : '#aaaaaa'}
            onChangeText={(text) => setRegionState((prev) => ({ ...prev, name: text }))}
        />

        <View style={style.colorPickerContainer}>
            <TextInput
                style={[style.input, { color: colorScheme === 'dark' ? '#ffffff' : '#000000', width: '50%' }]}
                placeholder="Color" value={regionState?.color}
                placeholderTextColor={colorScheme === 'dark' ? '#888888' : '#aaaaaa'}
                onChangeText={(text) => setRegionState((prev) => ({ ...prev, color: text }))}
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