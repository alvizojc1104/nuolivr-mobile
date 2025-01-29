import React, { useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet } from 'react-native';
import SignatureScreen, { SignatureViewRef } from 'react-native-signature-canvas';
import * as FileSystem from 'expo-file-system';
import { View } from 'react-native';
import { Button, Heading, SizableText, XStack, YStack } from 'tamagui';
import CustomButton from '@/components/CustomButton';
import { captureRef } from 'react-native-view-shot';
import { Redo, Trash, Undo } from '@tamagui/lucide-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { router } from 'expo-router';
import useStore from '@/hooks/useStore';
import Spinner from 'react-native-loading-spinner-overlay';

const Sign = ({ onOK = () => { } }: { onOK?: (signature: string) => void }) => {
    const setOcularMotilitySketchOS = useStore((state) => state.setOcularMotilitySketchOS);
    const [isLoading, setIsLoading] = useState(false)
    const removeOcularMotilitySketchOS = useStore((state) => state.removeOcularMotilitySketchOS);
    const ocularMotilitySketchOS = useStore((state) => state.ocularMotilitySketchOS);
    const [snapshotImg, setSnapshotImg] = useState<string | null>(ocularMotilitySketchOS ? ocularMotilitySketchOS : null);
    const ref = useRef<SignatureViewRef>(null);
    const snapshotRef = useRef(null)
    const { width } = Dimensions.get("window");
    const imgHeight = 450;
    const backgroundImgUri = "https://firebasestorage.googleapis.com/v0/b/nu-vision-696f6.appspot.com/o/os-draw.png?alt=media&token=12db55a4-fb2c-48a3-aa34-578ab79abc20";
    const style = `.m-signature-pad {box-shadow: none; border: none; }
                   .m-signature-pad--body {border: none;}
                   .m-signature-pad--footer {display: none; margin: 0px;}
                   body,html { width: "100%"; height: ${imgHeight}px;}`;

    const handleOK = async (signature: string) => {
        try {
            const background = await FileSystem.downloadAsync(backgroundImgUri, `${FileSystem.cacheDirectory}background.png`);
            const signatureData = signature.split('data:image/png;base64,')[1];

            const signaturePath = `${FileSystem.cacheDirectory}${new Date().toISOString()}.png`;
            await FileSystem.writeAsStringAsync(signaturePath, signatureData, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const combinedUri = await combineImages(background.uri, signaturePath);
            setSnapshotImg(combinedUri);
        } catch (error) {
            console.error("Error combining images:", error);
        }
    };

    const handleConfirm = (signature: any) => {
        console.log("end");
        ref.current?.readSignature();
        onOK(signature)
    };

    const handleClear = () => {
        ref.current?.clearSignature();
        if (snapshotImg) {
            setSnapshotImg(null)
            removeOcularMotilitySketchOS()
        } else {
            return;
        }
    };

    const handleCapture = async () => {
        setIsLoading(true)
        try {
            const uri = await captureRef(snapshotRef, { result: 'data-uri' });
            const fileUri = `${FileSystem.cacheDirectory}ocular-motility-${new Date().toISOString()}.png`;
            await FileSystem.writeAsStringAsync(fileUri, uri.split("data:image/png;base64,")[1], {
                encoding: FileSystem.EncodingType.Base64,
            });

            setOcularMotilitySketchOS(fileUri)
            router.back()
        } catch (error) {
            console.error("Error capturing snapshot:", error);
        } finally {
            setIsLoading(false)
        }
    };

    const handleUndo = () => { ref.current?.undo() }
    const handleRedo = () => { ref.current?.redo() }

    const combineImages = async (backgroundUri: string, signatureUri: string) => {
        // Here, you could use a library like `react-native-image-editor` or
        // manipulate the images in an HTML5 canvas if on web. Currently, combining images
        // natively on React Native requires an external tool or backend.

        // For now, this is a placeholder function to demonstrate how it might work.
        // Replace this with a proper image combination method.
        return signatureUri; // Placeholder - should return the URI of the combined image.
    };

    return (
        <>
            <Spinner animation="fade" visible={isLoading} />
            {snapshotImg ? (
                <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.preview}>
                    <Heading size={"$7"}>Preview</Heading>
                    <View style={[styles.snapshot, { width, height: imgHeight }]} ref={snapshotRef}>
                        <Image resizeMode='contain' src={backgroundImgUri} style={{ position: "absolute", width, height: imgHeight }} />
                        <Image resizeMode="contain" style={{ width, height: imgHeight, }} src={snapshotImg} />
                    </View>
                    <XStack padding="$3" alignItems='center' justifyContent='space-between' gap="$4">
                        <Button flex={1} onPress={handleClear} theme={"red_active"}>Retake</Button>
                        <CustomButton flex={1} buttonText='Save' onPress={handleCapture} />
                    </XStack>
                </Animated.View>
            ) : (
                <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
                    <XStack alignSelf="flex-end" gap="$4" marginRight="$3" position='absolute' zIndex={100_000} top={"$8"} right={"$2"}>
                        <YStack alignItems='center' justifyContent='center' gap="$1">
                            <Button elevate bordered circular icon={Undo} onPress={handleUndo} />
                            <SizableText size={"$3"}>Undo</SizableText>
                        </YStack>
                        <YStack alignItems='center' justifyContent='center' gap="$1">
                            <Button elevate bordered circular icon={Redo} onPress={handleRedo} />
                            <SizableText size={"$3"}>Redo</SizableText>
                        </YStack>
                        <YStack alignItems='center' justifyContent='center' gap="$1">
                            <Button elevate bordered circular icon={Trash} theme={"red_active"} onPress={handleClear} />
                            <SizableText size={"$3"}>Clear</SizableText>
                        </YStack>
                    </XStack>
                    <View style={[styles.snapshot, { width, height: imgHeight }]}>
                        <SignatureScreen
                            ref={ref}
                            bgSrc={backgroundImgUri}
                            bgHeight={imgHeight}
                            bgWidth={width}
                            onOK={handleOK}
                            descriptionText="Draw your signature"
                            webStyle={style}
                            penColor="#000"
                        />
                    </View>
                    <CustomButton buttonText='Preview' width={"100%"} onPress={() => handleConfirm} />
                </Animated.View>
            )}
        </>
    );
};

export default Sign;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: 10
    },
    snapshot: {
        backgroundColor: "white"
    },
    preview: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 6
    }
});
