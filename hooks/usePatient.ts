import { useState } from "react";
import axios from "axios";
import { SERVER } from "@/constants/link";
import { PatientInformation } from "@/types/PatientInformation";

export const usePatient = () => {
	const [patient, setPatient] = useState<PatientInformation | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchPatientById = async (patientId: string) => {
		setLoading(true);
		setError(null);
		try {
			const response = await axios.get(
				`${SERVER}/patient/get/${patientId}`
			);
			setPatient(response.data);
		} catch (err: any) {
			setError(err.message || "Failed to fetch patient");
		} finally {
			setLoading(false);
		}
	};

	// Return the patient data, loading state, error, and fetch function
	return { patient, loading, error, fetchPatientById };
};
