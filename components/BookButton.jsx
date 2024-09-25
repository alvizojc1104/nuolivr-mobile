import { router } from "expo-router";
import { Button } from "tamagui";

const BookButton = ({ route, title }) => {
  const goToBookAppointment = () => {
    router.push(`/${route}`);
  };
  return (
    <Button
      onPress={goToBookAppointment}
      fontWeight={900}
      paddingHorizontal="$6"
    >
      {title ? title : "Loading..."}
    </Button>
  );
};

export default BookButton;
