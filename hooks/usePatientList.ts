import { useState } from "react";
import axios from "axios";
import { SERVER } from "@/constants/link";
import { PatientInformation } from "@/types/PatientInformation";
import { useQuery } from "@tanstack/react-query";

const fetchPatients = async (clinicianId: string) => {
	const response = await axios.get(`${SERVER}/patients/${clinicianId}`);
	return response.data as PatientInformation[];
};

export const usePatientList = (clinicianId: string) => {
	const patients = useQuery({
		queryKey: ["patients", clinicianId],
		queryFn: async ({ queryKey }) => {
			const clinicianId = queryKey[1] as string;
			return await fetchPatients(clinicianId);
		},
		enabled: !!clinicianId,
	});

	return patients;
};
