import React from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import DetectImagestyles from "../styles/DetectImageStyles";

const DetectImage = ({ route }) => {
  const { croppedImageS3Url, originalImageS3Url, plotImageS3Url } =
    route.params;
  const [showResult, setShowResult] = useState(false);
  const [controlLine, setControlLine] = useState(0);
  const [testLine, setTestLine] = useState(0);

  useEffect(() => {
    // Simulating API call to get control and test line values
    setControlLine(Math.random().toFixed(2));
    setTestLine(Math.random().toFixed(2));
  }, []);

  return (
    <ScrollView contentContainerStyle={DetectImagestyles.scrollContainer}>
      <View style={DetectImagestyles.container}>
        <View style={DetectImagestyles.originalimageContainer}>
          <Image
            source={{ uri: originalImageS3Url }}
            style={DetectImagestyles.image}
            resizeMode="contain"
          />
        </View>
        <View style={DetectImagestyles.croppedimageContainer}>
          <Image
            source={{ uri: croppedImageS3Url }}
            style={DetectImagestyles.image}
            resizeMode="contain"
          />
        </View>
        <View style={DetectImagestyles.plotimageContainer}>
          <Image
            source={{ uri: plotImageS3Url }}
            style={DetectImagestyles.image}
            resizeMode="contain"
          />
        </View>

        {!showResult && (
          <TouchableOpacity
            style={DetectImagestyles.button}
            onPress={() => setShowResult(true)}
          >
            <Text style={DetectImagestyles.buttonText}>Result</Text>
          </TouchableOpacity>
        )}

        {showResult && (
          <View style={DetectImagestyles.resultContainer}>
            <Text style={DetectImagestyles.resultText}>
              Your result is Positive
            </Text>
          </View>
        )}

        <View style={DetectImagestyles.lineContainer}>
          <Text style={DetectImagestyles.lineLabel}>Control Line:</Text>
          <View style={DetectImagestyles.lineValueBox}>
            <Text style={DetectImagestyles.lineValue}>{controlLine}</Text>
          </View>
        </View>

        <View style={DetectImagestyles.lineContainer}>
          <Text style={DetectImagestyles.lineLabel}>Test Line:</Text>
          <View style={DetectImagestyles.lineValueBox}>
            <Text style={DetectImagestyles.lineValue}>{testLine}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
export default DetectImage;
