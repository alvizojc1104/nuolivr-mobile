import { HeaderBackButtonProps } from '@react-navigation/elements';
import { Check, ClipboardList, Filter, Pen, Plus } from '@tamagui/lucide-icons';
import { Link, Stack, useFocusEffect } from 'expo-router';
import { memo, useCallback, useState } from 'react';
import { Adapt, SizableText, Input, ScrollView, Sheet, XStack, View, Button, ListItem } from 'tamagui';

const items = [
    { filter: 1, text: "Today" },
    { filter: 7, text: "Last 7 days" },
    { filter: 14, text: "Last 14 days" },
    { filter: 30, text: "Last 30 days" },
]

const PreassessmentsScreen = () => {
    const [preAssessments, setPreAssessments] = useState<Array<String> | undefined>(undefined)
    const [filter, setFilter] = useState("")
    const [addNewPreAssessment, setAddNewPreAssessment] = useState(false)

    const setAddNewAssessment = () => {
        setAddNewPreAssessment(true)
    }

    return (
        <View flex={1}>
            <Stack.Screen options={{ headerRight: () => (<Button size="$3" marginRight="$3" themeInverse circular icon={Pen} onPress={setAddNewAssessment} />) }} />
            {preAssessments ? (
                <ScrollView flex={1} contentContainerStyle={{ padding: "$3", width: "100%" }}>
                    <XStack gap="$3">
                        <Input placeholder='Search' flex={4} />
                        <FilterSelect filter={filter} setFilter={setFilter} />
                    </XStack>
                </ScrollView>
            ) :
                (
                    <View flex={1} height="100%" justifyContent='center' alignItems='center'>
                        <SizableText size="$1">You have no pre-assessments yet.</SizableText>
                        <XStack width="100%" justifyContent='center' alignItems='center' marginTop="$1">
                            <SizableText size="$1" >{`Click `}</SizableText>
                            <Pen size={12} />
                            <SizableText size="$1">{` to start a new assessment.`}</SizableText>
                        </XStack>
                    </View>
                )
            }
            <AddNewPreAssessmentSheet addNewPreAssessment={addNewPreAssessment} setAddNewPreAssessment={setAddNewPreAssessment} />
        </View>
    );
};

export default PreassessmentsScreen;

const FilterSelect = memo(({ filter, setFilter }: any) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useFocusEffect(
        useCallback(() => {
            return () => {
                setIsSheetOpen(false); // Reset filter when navigating away
            };
        }, [setIsSheetOpen])
    );

    const handleFilterSelect = (selectedFilter: string) => {
        setFilter(selectedFilter);
        setIsSheetOpen(false); // Close the sheet after selecting a filter
    };

    return (
        <>
            <Button
                theme="active"
                onPress={() => setIsSheetOpen(true)} // Open the sheet when pressed
                iconAfter={Filter}
                flex={1}
            >
                {filter ? items.find(item => item.filter === filter)?.text : 'Filter'}
            </Button>

            <Sheet
                modal
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                dismissOnOverlayPress
                disableDrag
                snapPointsMode="fit"
            >
                <Sheet.Overlay
                    animation="lazy"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Sheet.Frame>
                    <SizableText margin="$3" fontWeight={900}>
                        Select Filter
                    </SizableText>
                    {items.map((item: any, index) => (
                        <ListItem
                            key={index}

                            title={item.text}
                            onPress={() => handleFilterSelect(item.filter)} // Handle the filter selection
                            pressTheme
                            iconAfter={filter == item.filter ? Check : null}
                            backgroundColor={filter == item.filter ? "$blue5" : "$background"}
                        />
                    ))}
                </Sheet.Frame>
            </Sheet>
        </>
    );
});


const AddNewPreAssessmentSheet = memo(({ addNewPreAssessment, setAddNewPreAssessment }: any) => {
    useFocusEffect(
        useCallback(() => {
            return () => {
                setAddNewPreAssessment(false);
            };
        }, [setAddNewPreAssessment])
    );
    return (
        <Sheet
            modal
            open={addNewPreAssessment}
            onOpenChange={setAddNewPreAssessment}
            dismissOnOverlayPress
            disableDrag
            snapPointsMode='fit'
        >
            <Sheet.Overlay
                animation="lazy"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
            />
            <Sheet.Frame>
                <SizableText margin="$3" fontWeight={900}>Add Pre-Assessment</SizableText>
                <Link href={'/(student)/pre-assessment/new'} asChild>
                    <ListItem icon={Plus} scaleIcon={1} title="New Patient" pressTheme />
                </Link>
                <Link href={'/(student)/pre-assessment/existing'} asChild>
                    <ListItem icon={ClipboardList} scaleIcon={1} title="Existing Patient" pressTheme />
                </Link>
            </Sheet.Frame>
        </Sheet>
    )
})