import { useColorScheme } from "react-native";

const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

export default {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },
};

export const light = {
  cyan1: "hsl(185, 60.0%, 98.7%)",
  cyan2: "hsl(185, 73.3%, 97.1%)",
  cyan3: "hsl(186, 70.2%, 94.4%)",
  cyan4: "hsl(186, 63.8%, 90.6%)",
  cyan5: "hsl(187, 58.3%, 85.4%)",
  cyan6: "hsl(188, 54.6%, 78.4%)",
  cyan7: "hsl(189, 53.7%, 68.7%)",
  cyan8: "hsl(189, 60.3%, 52.5%)",
  cyan9: "hsl(190, 95.0%, 39.0%)",
  cyan10: "hsl(191, 91.2%, 36.8%)",
  cyan11: "hsl(192, 85.0%, 31.0%)",
  cyan12: "hsl(192, 88.0%, 12.5%)",
};

export const dark = {
  cyan1: "hsl(192, 60.0%, 7.2%)",
  cyan2: "hsl(192, 71.4%, 8.2%)",
  cyan3: "hsl(192, 75.9%, 10.8%)",
  cyan4: "hsl(192, 79.3%, 12.8%)",
  cyan5: "hsl(192, 82.5%, 14.6%)",
  cyan6: "hsl(192, 86.6%, 16.9%)",
  cyan7: "hsl(192, 92.6%, 20.1%)",
  cyan8: "hsl(192, 100%, 24.5%)",
  cyan9: "hsl(190, 95.0%, 39.0%)",
  cyan10: "hsl(188, 100%, 40.0%)",
  cyan11: "hsl(186, 100%, 42.2%)",
  cyan12: "hsl(185, 73.0%, 93.2%)",
};

export const bg = () => {
  const colorScheme = useColorScheme()

  if (colorScheme === "light") {
      return "#FFF"
  } else {
      return dark.cyan3
  }
}
