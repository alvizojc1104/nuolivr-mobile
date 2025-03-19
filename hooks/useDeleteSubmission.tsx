import { SERVER } from '@/constants/link'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

type DeleteSubmissionQuery = {
      submissionId: string
      moduleId: string
      clinicianId: string
}


const useDeleteSubmission = () => {
      const deleteSubmission = useMutation({
            mutationKey: ['deleteSubmission'],
            mutationFn: async ({ submissionId, moduleId, clinicianId }: DeleteSubmissionQuery) => {
                  const { data } = await axios.delete(`${SERVER}/submission/delete/`, {
                        params: {
                              moduleId,
                              clinicianId,
                              submissionId
                        }
                  })
                  return data
            }
      })

      return deleteSubmission
}

export default useDeleteSubmission