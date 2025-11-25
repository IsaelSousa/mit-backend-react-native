import ColorPickerModal from '@/components/color_picker';
import { useColorScheme } from '@/hooks/use-color-scheme.web';
import { getItem, setItem } from '@/utils/AsyncStorage';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Toast } from 'toastify-react-native';
import { AddLocationParams } from './add_location';

export default function EditLocations() {
    const { region } = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const router = useRouter();

    const [openColorPicker, setOpenColorPicker] = useState<boolean>(false);
    const [regionState, setRegionState] = useState<AddLocationParams | null>(null);

    const handleEdit = () => {
        try {
            const getActualItems = getItem<AddLocationParams[]>('locations');

            getActualItems.then((items) => {
                if (items) {
                    const updatedItems = items.map(item => {
                        if (item.id === regionState?.id) {
                            return { ...item, ...regionState };
                        }
                        return item;
                    });
                    setItem('locations', updatedItems);
                }
            });

            Toast.success('Location edited successfully!');
            router.push('/');
        } catch (error) {
            Toast.error('Error editing location');
        }
    };

    const handleDeleteLocation = (id: string) => {
        try {
            const storage = getItem<AddLocationParams[]>('locations');

            storage.then((items) => {
                if (items) {
                    const filteredItems = items.filter(item => item.id !== id);
                    setItem('locations', filteredItems);
                    Toast.success('Location deleted successfully!');
                    router.push('/');
                }
            });

        } catch (error) {
            Toast.error('Error fetching locations');
        }
    };

    useEffect(() => {
        if (region) {
            const data = JSON.parse(region as string) as AddLocationParams;
            setRegionState(data);
        }
    }, [region]);

    return <View style={style.container}>
        <ColorPickerModal open={openColorPicker}
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

        <TouchableOpacity style={style.editButton} onPress={handleEdit}>
            <Text style={{ color: '#ffffff', fontSize: 20 }}>Edit Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[style.editButton, { backgroundColor: 'red' }]} onPress={() => handleDeleteLocation(regionState?.id || '')}>
            <Text style={{ color: '#ffffff', fontSize: 20 }}>Delete Location</Text>
        </TouchableOpacity>
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