import { RecordId } from "@/types/Record"
import api from "@/utils/axios"
import { useQuery } from "@tanstack/react-query"

const fetchPatientRecord = async (recordId: string) => {
      const { data } = await api.get(`/record/${recordId}`)
      return data as Partial<RecordId>
}

export const usePatientRecord = (recordId: string) => {
      const record = useQuery({
            queryKey: ["record", recordId],
            queryFn: () => fetchPatientRecord(recordId),
            refetchOnWindowFocus: "always",
            enabled: !!recordId,
      })
      return record
}