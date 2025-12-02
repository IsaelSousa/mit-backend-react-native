import { Button, Modal } from 'react-native';
import ColorPicker, { ColorFormatsObject, Swatches } from 'reanimated-color-picker';

interface IColorPickerProps {
    open: boolean;
    initialColor?: string;
    onComplete?: (color: ColorFormatsObject) => void;
    onClose?: () => void;
}

const ColorPickerModal: React.FC<IColorPickerProps> = ({ open, initialColor, onComplete, onClose }) => {
    return (
        <Modal visible={open} animationType="slide" transparent={true}>
            <ColorPicker style={{ width: '95%', backgroundColor: 'white', marginTop: '35%', paddingHorizontal: 20, paddingVertical: 20, marginLeft: 10, marginRight: 10 }} value={initialColor} onComplete={onComplete}>
                <Swatches />

                <Button title='Ok' onPress={onClose} />
            </ColorPicker>
        </Modal>
    );
}

export default ColorPickerModal;