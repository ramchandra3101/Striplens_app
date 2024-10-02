import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainPage from "./components/MainPage";
import ImagePreview from "./components/ImagePreview";
import Header from "./components/Header";
import DetectImage from "./components/DetectImage";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Header />
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={MainPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ImagePreview"
          component={ImagePreview}
          options={{ title: "Image Preview" }}
        />
        <Stack.Screen
          name="DetectImage"
          component={DetectImage}
          options={{ title: "Detected Signal" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
