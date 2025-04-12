import { Canvas, DiffRect, rect, rrect, Text, useFont } from "@shopify/react-native-skia";
import { Dimensions, Platform, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const innerDimension = 300;

const outer = rrect(rect(0, 0, width, height), 0, 0);
const inner = rrect(
  rect(
    width / 2 - innerDimension / 2,
    height / 2 - innerDimension / 2,
    innerDimension,
    innerDimension
  ),
  50,
  50
);

export const Overlay = () => {
  // Load the font with a smaller size
  const font = useFont(require('@/assets/fonts/SpaceMono-Regular.ttf'), 14); // Adjust the font size as needed

  if (!font) {
    return null; // Ensure the font is loaded before rendering the text
  }

  // Define the text and calculate its width
  const text = "Scan Attendance QR Code";
  const textWidth = font.getTextWidth(text);  // Get the width of the text

  return (
    <Canvas
      style={
        Platform.OS === "android" ? { flex: 1 } : StyleSheet.absoluteFillObject
      }
    >
      <DiffRect inner={inner} outer={outer} color="black" opacity={0.5} />
      {/* Center the text horizontally */}
      <Text
        x={(width - textWidth) / 2}  // Center the text by subtracting half of its width from screen width
        y={height / 2 + innerDimension / 2 + 50}  // Position below the QR code area
        font={font}
        color="white"
        text={text}
      />
    </Canvas>
  );
};

