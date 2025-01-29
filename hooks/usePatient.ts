import { useState } from "react";
import axios from "axios"; // Assuming you're using axios for HTTP requests
import { SERVER } from "@/constants/link";

type FormData = {
  _id: string;
  patient_id: string;
  imageUrl: string;
  firstName: string;
  middleName: string;
  lastName: string;
  birthdate: Date;
  gender: string;
  age: number;
  civilStatus: string;
  occupationOrCourse: string;
  hobbiesOrAvocation: string;
  contactInformation: {
    fullAddress: string;
    emailAddress: string;
    mobile: string;
  };
  records: any;
  createdAt: Date;
};

export const usePatient = () => {
  const [patient, setPatient] = useState<FormData | null>(null); // State to store the patient data
  const [loading, setLoading] = useState(false); // State to track loading
  const [error, setError] = useState(null); // State to track any errors

  // Function to fetch the patient by ID
  const fetchPatientById = async (patientId: string) => {
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const response = await axios.get(
        `${SERVER}/patient/get/${patientId}`
      );
      setPatient(response.data); // Update state with the fetched patient data
    } catch (err: any) {
      setError(err.message || "Failed to fetch patient");
    } finally {
      setLoading(false);
    }
  };

  // Return the patient data, loading state, error, and fetch function
  return { patient, loading, error, fetchPatientById };
};
