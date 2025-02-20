import { ExternalEyeExamination, Phorometry, VisualAcuity } from "@/types/Record";
import { Ophthalmoscopy } from "./PatientRecord";

export interface SelectRecord {
	_id: string;
	patientId: PatientId;
	clinicianId: string;
	eyeTriage: EyeTriage;
	patientCaseRecord: PatientCaseRecord;
	preliminaryExamination: PreliminaryExamination;
	phorometry: Phorometry;
	visualAcuity: VisualAcuity;
	ophthalmoscopy: Ophthalmoscopy;
	externalEyeExamination: ExternalEyeExamination;
	isComplete: boolean;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface PatientId {
	contactInformation: ContactInformation;
	_id: string;
	imageUrl: string;
	firstName: string;
	middleName: string;
	lastName: string;
	birthdate: string;
	occupationOrCourse: string;
	hobbiesOrAvocation: string;
	gender: string;
	civilStatus: string;
	age: number;
	records: any[];
	addedBy: string;
	createdAt: string;
	updatedAt: string;
	patient_id: string;
	__v: number;
}

export interface ContactInformation {
	mobile: string;
	emailAddress: string;
	fullAddress: string;
}

export interface EyeTriage {
	flashes: string;
	flashesStarted: string;
	hasFlashesOrFloaters: string;
	hasRecentIllnesses: string;
	isExperiencingPainItchingDiscomfort: string;
	isExperiencingSymptoms: string;
	isExposedToChemicalIrritantsAllergens: string;
	symptomBegins: string;
	symptomsSpecified: string;
	isComplete: boolean;
	_id: string;
	createdAt: string;
	updatedAt: string;
}

export interface PatientCaseRecord {
	chiefComplaints: ChiefComplaints;
	contactLensHistory: ContactLensHistory;
	familyOcularAndHealthHistory: FamilyOcularAndHealthHistory;
	initialObservation: InitialObservation;
	medicalHistory: MedicalHistory;
	ocularHistory: OcularHistory;
	socialHistory: SocialHistory;
	spectacleHistory: SpectacleHistory;
	isComplete: boolean;
	_id: string;
	createdAt: string;
	updatedAt: string;
}

export interface ChiefComplaints {
	nonVisualComplaints: any[];
	visualComplaints: any[];
}

export interface ContactLensHistory {
	contactLensBrand: string;
	contactLensDosage: string;
	contactLensDuration: string;
	contactLensFrequency: string;
	contactLensPrescription: string;
	contactLensType: string;
	usesEyedrop: string;
	usingOrWearingContactLens: string;
}

export interface FamilyOcularAndHealthHistory {
	history: any[];
	other: string;
}

export interface InitialObservation {
	facialSymmetry: string;
	headPosition: string;
	odor: string;
	patientGait: string;
	skinColor: string;
	speech: string;
}

export interface MedicalHistory {
	hypersensitivy: string;
	medicalAllergies: string;
	medicalDosage: string;
	medicalDuration: string;
	medicineType: string;
}

export interface OcularHistory {
	majorIllness: string;
	majorProblems: string;
	previousEyeSurgery: string;
	similarProblemBefore: string;
}

export interface SocialHistory {
	socialHistory: any[];
	socialHistoryDuration: string;
}

export interface SpectacleHistory {
	spectacleDuration: string;
	spectacleFrequency: string;
	spectaclePrescription: string;
	usingOrWearingSpectacle: string;
}

export interface PreliminaryExamination {
	isComplete: boolean;
	_id: string;
	createdAt: string;
	updatedAt: string;
}
