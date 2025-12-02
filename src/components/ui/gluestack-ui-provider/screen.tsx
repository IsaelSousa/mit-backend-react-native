import { useThemeColor } from '@/src/hooks/use-theme-color';
import { View } from 'react-native';

type Props = {
    children?: React.ReactNode;
};

export default function Screen(props: Props) {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <View style={{ backgroundColor, flex: 1 }}>
      {props.children}
    </View>
  );
}