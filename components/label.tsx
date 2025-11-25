import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, Text } from "react-native";

type Props = {
    label?: string;
    style?: object;
};

export default function Label(props: Props) {
    const textColor = useThemeColor({}, 'text');
    return <Text style={[{ ...styles.label, color: textColor }, props.style]}>{props.label}</Text>;
}

const styles = StyleSheet.create({
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10,
    }
});