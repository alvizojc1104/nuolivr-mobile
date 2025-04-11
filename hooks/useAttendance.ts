import { useContext } from "react";
import AttendanceContext from "@/context/AttendanceContext";

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  
  if (context === undefined) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  
  return context;
};
