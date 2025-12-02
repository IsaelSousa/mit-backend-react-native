import { BellIcon, Icon } from "@/src/components/ui/icon";
import {
    Modal,
    ModalBackdrop,
    ModalBody,
    ModalContent
} from '@/src/components/ui/modal';
import { Pressable } from "@/src/components/ui/pressable";
import { Text } from '@/src/components/ui/text';
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { selectNotifications } from "@/src/store/reducers/notificationSlice";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

type Props = {
    label?: string;
    style?: object;
};

export default function Label(props: Props) {
    const messages = useSelector(selectNotifications);

    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const handleClose = () => setShowAlertDialog(false);

    const textColor = useThemeColor({}, 'text');

    return <View style={styles.row}>
        <Text style={[{ ...styles.label, color: textColor }, props.style]}>{props.label}</Text>
        <Pressable onPress={() => messages.length > 0 && setShowAlertDialog(true)} className="flex-row items-center">
            {<Text style={{ marginRight: 5, color: textColor }}>{messages.length}</Text>}
            <Icon as={BellIcon} color={textColor} size="xl" />
        </Pressable>

        <Modal isOpen={showAlertDialog} onClose={handleClose} size="md">
            <ModalBackdrop />
            <ModalContent>
                {messages.map((message) => (
                    <ModalBody key={message.id} className="border-b border-gray-200 last:border-0 px-4 py-2">
                        <Text style={{ color: textColor }}>{message.text}</Text>
                        <Text style={{ color: textColor, fontSize: 12 }}>{new Date(message.timestamp).toLocaleString()}</Text>
                    </ModalBody >
                ))}
            </ModalContent>
        </Modal>
    </View>;
}

const styles = StyleSheet.create({
    label: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    }
});