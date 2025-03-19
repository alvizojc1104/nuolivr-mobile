import { SubmissionStatus } from "@/app/student/(drawer)/(home)/module/Submissions";

export const switchStatusColor = (status: string) => {
	switch (status) {
		case SubmissionStatus.APPROVED:
			return "green";
		case SubmissionStatus.FOR_APPROVAL:
			return "gold";
		case SubmissionStatus.FOR_REVALIDATION:
			return "blue";
		case SubmissionStatus.REJECTED:
			return "red";
		default:
			return "white";
	}
};
