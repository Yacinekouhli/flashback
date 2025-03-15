import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import UploadScreen from './screens/UploadScreen';
import ResultScreen from './screens/ResultScreen';
import IconicSelectionScreen from './screens/IconicSelectionScreen'; // <--- Import

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="IconicSelection" component={IconicSelectionScreen} />
        <Stack.Screen name="Upload" component={UploadScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
