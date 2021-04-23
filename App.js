import React, { useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { FourCorners } from './FourCorners';

const items = [
  { imageSource: require('./assets/beach.jpg'), text: 'Beach' },
  { imageSource: require('./assets/forest.jpg'), text: 'Forest' },
  { imageSource: require('./assets/desert.jpg'), text: 'Desert' },
  { imageSource: require('./assets/plains.jpg'), text: 'Plains' },
]

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 15,
    }}>
      <FourCorners
        items={items}
        selectedIndex={selectedIndex}
        size={Dimensions.get('window').width - 30}
      />
      <TouchableOpacity style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        width: '100%',
        marginHorizontal: 15,
        height: 100,
        marginTop: 20,
      }}
        onPress={() => {
          if (selectedIndex == null)
            setSelectedIndex(0);
          else
            setSelectedIndex((selectedIndex + 1) % 4);
        }}
      >
        <Text style={{ color: 'white', fontSize: 36 }}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
}