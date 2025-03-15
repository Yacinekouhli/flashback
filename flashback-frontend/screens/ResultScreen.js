import { View, Image, Text } from 'react-native';

export default function ResultScreen({ route }) {
  const { flashback_image } = route.params;

  const imageUrl = `http://localhost:8000/flashbacks/${flashback_image}`;

  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text style={{ fontSize:20, marginBottom:20 }}>🎉 Voici ton Flashback !</Text>
      <Image source={{ uri: imageUrl }} style={{ width:300, height:300 }} />
    </View>
  );
}

