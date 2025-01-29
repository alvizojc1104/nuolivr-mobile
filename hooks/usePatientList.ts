import { useState } from "react";
import axios from "axios";
import { SERVER } from "@/constants/link";

export const usePatientList = () => {
  const [patients, setPatients] = useState<Object[] | null>(null); // State to store the patient data
  const [loading, setLoading] = useState(false); // State to track loading
  const [error, setError] = useState<string | null>(null); // State to track any errors

  const fetchPatients = async (clinicianId: string | undefined) => {
    setLoading(true); // Set loading to true when starting the fetch
    setError(null); // Reset any previous error

    try {
      const response = await axios.get(`${SERVER}/patients/${clinicianId}`); // Adjust the endpoint as needed
      setPatients(response.data); // Update state with retrieved patients
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching patients."); // Handle errors
    } finally {
      setLoading(false); // Set loading to false once fetching is complete
    }
  };

  return {
    patients,
    loading,
    error,
    fetchPatients,
  };
};
