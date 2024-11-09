import { useColorScheme } from "react-native"

export const theme = {
    cyan1: 'hsl(185, 60.0%, 98.7%)',
    cyan2: 'hsl(185, 73.3%, 97.1%)',
    cyan3: 'hsl(186, 70.2%, 94.4%)',
    cyan4: 'hsl(186, 63.8%, 90.6%)',
    cyan5: 'hsl(187, 58.3%, 85.4%)',
    cyan6: 'hsl(188, 54.6%, 78.4%)',
    cyan7: 'hsl(189, 53.7%, 68.7%)',
    cyan8: 'hsl(189, 60.3%, 52.5%)',
    cyan9: 'hsl(190, 95.0%, 39.0%)',
    cyan10: 'hsl(191, 91.2%, 36.8%)',
    cyan11: 'hsl(192, 85.0%, 31.0%)',
    cyan12: 'hsl(192, 88.0%, 12.5%)',
}

export const darkTheme = {
    cyan1: 'hsl(192, 60.0%, 7.2%)',
    cyan2: 'hsl(192, 71.4%, 8.2%)',
    cyan3: 'hsl(192, 75.9%, 10.8%)',
    cyan4: 'hsl(192, 79.3%, 12.8%)',
    cyan5: 'hsl(192, 82.5%, 14.6%)',
    cyan6: 'hsl(192, 86.6%, 16.9%)',
    cyan7: 'hsl(192, 92.6%, 20.1%)',
    cyan8: 'hsl(192, 100%, 24.5%)',
    cyan9: 'hsl(190, 95.0%, 39.0%)',
    cyan10: 'hsl(188, 100%, 40.0%)',
    cyan11: 'hsl(186, 100%, 42.2%)',
    cyan12: 'hsl(185, 73.0%, 93.2%)',
}

export const gray = {
    gray1: 'hsl(0, 0%, 99.0%)',
    gray2: 'hsl(0, 0%, 97.3%)',
    gray3: 'hsl(0, 0%, 95.1%)',
    gray4: 'hsl(0, 0%, 93.0%)',
    gray5: 'hsl(0, 0%, 90.9%)',
    gray6: 'hsl(0, 0%, 88.7%)',
    gray7: 'hsl(0, 0%, 85.8%)',
    gray8: 'hsl(0, 0%, 78.0%)',
    gray9: 'hsl(0, 0%, 56.1%)',
    gray10: 'hsl(0, 0%, 52.3%)',
    gray11: 'hsl(0, 0%, 43.5%)',
    gray12: 'hsl(0, 0%, 9.0%)',
}

export const darkGray = {
    gray1: 'hsl(0, 0%, 8.5%)',
    gray2: 'hsl(0, 0%, 11.0%)',
    gray3: 'hsl(0, 0%, 13.6%)',
    gray4: 'hsl(0, 0%, 15.8%)',
    gray5: 'hsl(0, 0%, 17.9%)',
    gray6: 'hsl(0, 0%, 20.5%)',
    gray7: 'hsl(0, 0%, 24.3%)',
    gray8: 'hsl(0, 0%, 31.2%)',
    gray9: 'hsl(0, 0%, 43.9%)',
    gray10: 'hsl(0, 0%, 49.4%)',
    gray11: 'hsl(0, 0%, 62.8%)',
    gray12: 'hsl(0, 0%, 93.0%)',
}

export const bg = () => {
    const colorScheme = useColorScheme()

    if (colorScheme === "light") {
        return "#FFF"
    } else {
        return darkTheme.cyan1
    }
}
