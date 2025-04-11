import React, { createContext, useContext, useState, ReactNode } from "react";

export interface QRCodeData {
	facultyId: string;
	modules: string[];
}

export interface Module {
	timeIn: string | null;
	timeOut: string | null;
	_id: string;
	name: string;
	acronym: string;
	imageUrl: string | null;
	createdBy: string;
	updatedAt: string;
}

export interface AttendanceData {
	facultyId?: string;
	studentModules?: Module[];
	selectedModule?: Module;
	message?: string;
	scanSuccess?: boolean;
	scanMessage?: string;
}

interface AttendanceContextType {
	attendanceData: AttendanceData;
	setAttendanceData: React.Dispatch<React.SetStateAction<AttendanceData>>;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(
	undefined
);

interface AttendanceProviderProps {
	children: ReactNode;
}

export const AttendanceProvider: React.FC<AttendanceProviderProps> = ({
	children,
}) => {
	const [attendanceData, setAttendanceData] = useState<AttendanceData>({});

	return (
		<AttendanceContext.Provider
			value={{
				attendanceData,
				setAttendanceData,
			}}
		>
			{children}
		</AttendanceContext.Provider>
	);
};

export default AttendanceContext;
