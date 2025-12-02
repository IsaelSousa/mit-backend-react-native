import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export interface ListActionsButtonsProps {
    listActions?: { icon: React.ReactNode; onPress?: () => void }[];
}

const ListActionsButtons = ({ listActions }: ListActionsButtonsProps) => {
    const colorScheme = useColorScheme();

    return (
        <View style={styles.container}>
            {listActions?.map((action, index) => (
                <TouchableOpacity key={index} onPress={action.onPress} style={[styles.fab, { backgroundColor: colorScheme === 'dark' ? '#1d1d1d' : '#ffffff' }]}>
                    <Text style={styles.fabText}>{action.icon}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

export default ListActionsButtons;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        position: 'absolute',
        bottom: 30,
        right: 30,
        gap: 16
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 56 / 2,
        justifyContent: 'center',
        alignItems: 'center',
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
    }
});