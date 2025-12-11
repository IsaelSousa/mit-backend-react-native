import ColorPickerModal from "@/src/components/color_picker";
import { Button, ButtonText } from "@/src/components/ui/button";
import { DownloadIcon, Icon } from "@/src/components/ui/icon";
import { useColorScheme } from "@/src/hooks/use-color-scheme.web";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Toast } from "toastify-react-native";
import { useLocation } from "../hooks/useLocation";
import { UpdateLocationParams } from "../services/queries/country/location";

export default function EditLocations() {
    const { region } = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const router = useRouter();

    const { updateData, deleteData } = useLocation();

    const [loading, setLoading] = useState<boolean>(false);
    const [openColorPicker, setOpenColorPicker] = useState<boolean>(false);
    const [regionState, setRegionState] = useState<UpdateLocationParams>({
        updateLocationId: '',
        name: '',
        latitude: 0,
        longitude: 0,
        color: '',
        imageBase64: ''
    });

    const handleEdit = () => {
        try {
            updateData({
                updateLocationId: regionState.updateLocationId,
                name: regionState.name,
                latitude: regionState.latitude,
                longitude: regionState.longitude,
                color: regionState.color,
                imageBase64: regionState.imageBase64 || ''
            });

            Toast.success('Location edited successfully!');
            router.push('/');
        } catch (error) {
            Toast.error('Error editing location');
        }
    };

    const handleDeleteLocation = async () => {
        try {
            setLoading(true);
            console.log('Deleting location with id:', regionState.updateLocationId);
            const { data } = await deleteData(regionState.updateLocationId);

            if (data?.deleteLocation) {
                setLoading(false);
                Toast.success('Location deleted successfully!');
                router.push('/');
            }
        } catch (error) {
            Toast.error('Error fetching locations');
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
            const data = JSON.parse(region as string) as UpdateLocationParams;
            setRegionState(data);
        }
    }, [region]);

    return <View style={style.container}>
        <ColorPickerModal open={openColorPicker}
            onComplete={(color) => {
                setRegionState((prev) => ({ ...prev, color: color.hex }));
                setOpenColorPicker(false);
            }}
            onClose={() => setOpenColorPicker(false)}
        />

        <ActivityIndicator animating={loading} size="large" color="#0000ff" />

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

        <View style={{ alignItems: 'center', flexDirection: 'column' }}>
            <Button className="mt-4" variant="solid" action="positive" size="md" onPress={handleEdit}>
                <ButtonText size="lg" className="p-2" style={{ color: colorScheme === 'dark' ? '#ffffff' : '#000000' }}>Save Location</ButtonText>
            </Button>

            <Button className="mt-4" variant="solid" action="positive" size="md" onPress={() => handleDeleteLocation()}>
                <ButtonText size="lg" className="p-2" style={{ color: colorScheme === 'dark' ? '#ffffff' : '#000000' }}>Delete Location</ButtonText>
            </Button>

            <Button className="mt-4 ml-4" variant="solid" action="positive" size="md" onPress={pickImage}>
                <Icon as={DownloadIcon} size="xl" color={colorScheme === "dark" ? "#ffffff" : "#000000"} />
            </Button>
        </View>

        {regionState?.imageBase64 && (
            <View style={{ marginTop: 20, padding: 2, elevation: 8, backgroundColor: '#000' }}>
                <Image
                    source={{ uri: `data:image/jpeg;base64,${regionState.imageBase64}` }}
                    style={{ width: 200, height: 200 }}
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
    editButton: { marginTop: 30, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#007AFF' },
    removeBUtton: { marginTop: 15, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, backgroundColor: '#FF3B30' },
    colorPickerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    colorPickerButton: { width: '30%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 20 }
});