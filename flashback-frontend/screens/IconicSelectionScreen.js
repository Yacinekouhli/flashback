import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
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
      // Selon ton backend, c'est { "iconic_images": ["abbey_road.jpg", ...] }
      setIconicImages(response.data.iconic_images);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleSelectIconic = (iconic) => {
    setSelectedIconic(iconic);
  };

  // Quand on clique sur "Continuer", on passe l'image iconique sélectionnée
  // à l'écran d'upload (ou directement à l'écran de génération, selon ton flow)
  const goToUpload = () => {
    if (!selectedIconic) return;
    // On passe la valeur via les params de navigation
    navigation.navigate('Upload', { iconicFilename: selectedIconic });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Choisis une image iconique :</Text>
      
      {iconicImages.map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => handleSelectIconic(item)}
          style={{
            padding: 10,
            marginVertical: 5,
            backgroundColor: item === selectedIconic ? '#ccc' : '#eee',
          }}
        >
          <Text>{item}</Text>
        </TouchableOpacity>
      ))}

      <Button
        title="Continuer"
        onPress={goToUpload}
        disabled={!selectedIconic}
      />
    </View>
  );
}
