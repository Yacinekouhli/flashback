// screens/IconicSelectionScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { api } from '../services/api';

export default function IconicSelectionScreen({ navigation }) {
  const [iconicImages, setIconicImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIconic, setSelectedIconic] = useState(null);

  useEffect(() => {
    fetchIconicImages();
  }, []);

  const fetchIconicImages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/images/iconic');
      // Ex: { "iconic_images": ["mona_lisa.jpg", "abbey_road.png", ...] }
      setIconicImages(response.data.iconic_images);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectIconic = (filename) => {
    setSelectedIconic(filename);
  };

  const goToUpload = () => {
    if (!selectedIconic) return;
    // Passe le nom de fichier iconique à l'écran d'upload
    navigation.navigate('Upload', { iconicFilename: selectedIconic });
  };

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex:1, padding:20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        Sélectionnez une image iconique :
      </Text>

      {iconicImages.map((item) => {
        // Construire l'URL pour accéder à l'image 
        // (adapte "localhost" selon ton environnement : 10.0.2.2 pour l'émulateur Android, etc.)
        const imageUrl = `http://localhost:8000/iconic/${item}`;

        return (
          <TouchableOpacity
            key={item}
            onPress={() => handleSelectIconic(item)}
            style={{
              backgroundColor: item === selectedIconic ? '#ddd' : '#eee',
              marginVertical: 5,
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Image
              source={{ uri: imageUrl }}
              style={{ width: 50, height: 50, marginRight: 10 }}
            />
            <Text>{item}</Text>
          </TouchableOpacity>
        );
      })}

      <Button
        title="Continuer"
        onPress={goToUpload}
        disabled={!selectedIconic}
      />
    </View>
  );
}
