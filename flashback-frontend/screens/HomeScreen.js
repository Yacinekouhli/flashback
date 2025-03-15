// HomeScreen.js
import { View, Button, Text } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text style={{ fontSize:24, marginBottom:20 }}>Bienvenue sur Flashback 🎉</Text>
      <Button
        title="Créer mon Flashback"
        onPress={() => navigation.navigate('IconicSelection')}
      />
    </View>
  );
}
