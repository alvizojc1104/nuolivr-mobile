import { RecordId } from "./Record";

export type ContactInformation = {
	mobile: string;
	emailAddress: string;
	fullAddress: string;
};

export enum Gender {
	MALE = "male",
	FEMALE = "female",
	OTHER = "other",
}

export enum CivilStatus {
	SINGLE = "single",
	MARRIED = "married",
	DIVORCED = "divorced",
	WIDOWED = "widowed",
}

export type PatientInformation = {
	_id: string;
	patient_id: string;
	imageUrl: string;
	firstName: string;
	middleName: string;
	lastName: string;
	fullName: string;
	contactInformation: ContactInformation;
	birthdate: string;
	occupationOrCourse: string;
	hobbiesOrAvocation: string;
	gender: Gender;
	civilStatus: CivilStatus;
	age: number;
	records: RecordId[];
    createdAt: string;
};
