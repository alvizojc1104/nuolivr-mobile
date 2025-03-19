import { PatientInformation } from "@/types/PatientInformation";
export enum SubmissionStatus {
	FOR_APPROVAL = "for approval",
	APPROVED = "approved",
	FAILED = "failed",
	REJECTED = "rejected",
	FOR_REVALIDATION = "for revalidation",
}
export type CorrectionItem = {
	currentValue: string;
	correction: string;
	resolved: boolean;
	correctionId: string;
	fieldName: string;
	addedBy: string | unknown;
};
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ISubmission {
	message: string;
	submissions: Submission[];
	clinician: RecordClinician;
}

export interface RecordClinician {
	_id: string;
	createdAt: string;
	emailAddress: string;
	firstName: string;
	fullName: string;
	imageUrl: string;
	lastActive: string;
	phoneNumber: string;
	lastName: string;
	middleName: string;
	role: string[];
}

export interface Submission {
	_id: string;
	clinicianId: RecordClinician;
	recordId: RecordId;
	moduleId: ModuleId;
	status: SubmissionStatus;
	corrections: CorrectionItem[];
	notes: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface RecordData {
	message: string;
	submission: RecordId;
}

export interface RecordId {
	_id: string;
	patientId: PatientInformation;
	clinicianId: string;
	eyeTriage: EyeTriage;
	patientCaseRecord: PatientCaseRecord;
	preliminaryExamination: PreliminaryExamination;
	createdAt: string;
	updatedAt: string;
	__v: number;
	visualAcuity: VisualAcuity;
	phorometry: Phorometry;
	externalEyeExamination: ExternalEyeExamination;
	ophthalmoscopy: Ophthalmoscopy;
	isComplete: boolean;
}

export interface PatientId {
	_id: string;
	imageUrl: string;
	firstName: string;
	middleName: string;
	lastName: string;
	fullName: string;
	patient_id: string;
	age: number;
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
	nonVisualComplaints: string[];
	visualComplaints: string[];
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
	history: string[];
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
	socialHistory: string[];
	socialHistoryDuration: string;
}

export interface SpectacleHistory {
	spectacleDuration: string;
	spectacleFrequency: string;
	spectaclePrescription: string;
	usingOrWearingSpectacle: string;
}

export interface PreliminaryExamination {
	pupillaryDistance: PupillaryDistance;
	ocularDominance: OcularDominance;
	cornealReflex: CornealReflex;
	pupillaryFunction: PupillaryFunction;
	perrla: Perrla;
	coverTest: CoverTest;
	motilityTest: MotilityTest;
	stereoptyTest: StereoptyTest;
	colorVision: ColorVision;
	ocularMotility: OcularMotility;
	nearPointAccomodation: NearPointAccomodation;
	nearPointConvergence: NearPointConvergence;
	physiologicDiplopia: string;
	subjectiveOrObjective: string;
	cornealReflexImgUrl: string;
	isComplete: boolean;
	_id: string;
	createdAt: string;
	updatedAt: string;
}

export interface PupillaryDistance {
	monocular: Monocular;
	binocular: Binocular;
}

export interface Monocular {
	OD: string;
	OS: string;
}

export interface Binocular {
	near: string;
	far: string;
}

export interface OcularDominance {
	dominantEye: string;
	dominantHand: string;
	note: string;
}

export interface CornealReflex {
	note: string;
}

export interface PupillaryFunction {
	direct: string;
	indirect: string;
}

export interface Perrla {
	eod: string;
	eos: string;
	lod: string;
	los: string;
	aod: string;
	aos: string;
}

export interface CoverTest {
	unilateral: Unilateral;
	alternate: Alternate;
	note?: string;
}

export interface Unilateral {
	far: Far;
	near: Near;
}

export interface Far {
	od: string;
	os: string;
}

export interface Near {
	od: string;
	os: string;
}

export interface Alternate {
	far: Far2;
	near: Near2;
}

export interface Far2 {
	od: string;
	os: string;
}

export interface Near2 {
	od: string;
	os: string;
}

export interface MotilityTest {
	version: Version;
	duction: Duction;
	note: string;
}

export interface Version {
	broadH: string;
	saccades: string;
	pursuit: string;
}

export interface Duction {
	od: string;
	os: string;
}

export interface StereoptyTest {
	stereopsis: string;
}

export interface ColorVision {
	ishihara: Ishihara;
}

export interface Ishihara {
	od: string;
	os: string;
}

export interface OcularMotility {
	od: string;
	os: string;
}

export interface NearPointAccomodation {
	od: Od;
	os: Os;
	ou: Ou;
}

export interface Od {
	trial1: string;
	trial2: string;
	trial3: string;
}

export interface Os {
	trial1: string;
	trial2: string;
	trial3: string;
}

export interface Ou {
	trial1: string;
	trial2: string;
	trial3: string;
}

export interface NearPointConvergence {
	ou: Ou2;
}

export interface Ou2 {
	trial1: string;
	trial2: string;
	trial3: string;
}

export interface VisualAcuity {
	aided: Aided;
	pinhole: Pinhole;
	refraction: Refraction;
	unaided: Unaided;
	isComplete: boolean;
	keratometry: string;
	diagnosis: string;
	recommendation: string;
	_id: string;
	createdAt: string;
	updatedAt: string;
}

export interface Aided {
	distance: Distance;
	near: Near3;
	note: string;
}

export interface Distance {
	od: string;
	os: string;
	ou: string;
}

export interface Near3 {
	od: string;
	os: string;
	ou: string;
}

export interface Pinhole {
	OD: string;
	OS: string;
	note: string;
}

export interface Refraction {
	od: Od2;
	os: Os2;
	add: string;
	autorefractometer: string;
	readingRange: string;
	finalRx: string;
	modifications: string;
}

export interface Od2 {
	dcylx: string;
	dsph: string;
	od: string;
	va: string;
}

export interface Os2 {
	dcylx: string;
	dsph: string;
	os: string;
	va: string;
}

export interface Unaided {
	distance: Distance2;
	near: Near4;
	note: string;
}

export interface Distance2 {
	od: string;
	os: string;
	ou: string;
}

export interface Near4 {
	od: string;
	os: string;
	ou: string;
}

export interface Phorometry {
	phoria: Phoria;
	duction: Duction2;
	vergence: Vergence;
	crossCylinder: CrossCylinder;
	accomodativeTest: AccomodativeTest;
	isComplete: boolean;
	_id: string;
	createdAt: string;
	updatedAt: string;
}

export interface Phoria {
	distance: Distance3;
	near: Near5;
}

export interface Distance3 {
	horizontalvt3: string;
	vt8: string;
	verticalvt12: string;
}

export interface Near5 {
	horizontalvt13a: string;
	vt13b: string;
	verticalvt18: string;
}

export interface Duction2 {
	distance: Distance4;
	near: Near6;
}

export interface Distance4 {
	sbdod: string;
	sbdos: string;
	lbuod: string;
	lbuos: string;
}

export interface Near6 {
	sbdod: string;
	sbdos: string;
	lbuod: string;
	lbuos: string;
}

export interface Vergence {
	distance: Distance5;
	near: Near7;
}

export interface Distance5 {
	bovt9: string;
	vt10: string;
	bivt11: string;
}

export interface Near7 {
	bovt16a: string;
	vt16b: string;
	bivt17a: string;
	vt17b: string;
}

export interface CrossCylinder {
	distance: Distance6;
	near: Near8;
}

export interface Distance6 {
	dissociatedOD: string;
	phoriaOD: string;
}

export interface Near8 {
	binocularOD: string;
	phoriaOS: string;
}

export interface AccomodativeTest {
	aoa: Aoa;
	pra: string;
	nra: string;
	gradientAcaRatio: string;
	calculatedAcaRatio: string;
	hoffstetersFormula: string;
}

export interface Aoa {
	od: string;
	os: string;
	ou: string;
}

export interface ExternalEyeExamination {
	eyelid: Eyelid;
	eyelashes: Eyelashes;
	eyebrows: Eyebrows;
	cornea: Cornea;
	sclera: Sclera;
	iris: Iris;
	pupil: Pupil;
	lensmedia: Lensmedia;
	conjunctiva: Conjunctiva;
	bulbarConjunctiva: BulbarConjunctiva;
	palpebral: Palpebral;
	palpebralFissure: PalpebralFissure;
	anteriorChamber: AnteriorChamber;
	isComplete: boolean;
	instrumentsUsed: string;
	otherObservation: string;
	_id: string;
	createdAt: string;
	updatedAt: string;
}

export interface Eyelid {
	od: string;
	os: string;
}

export interface Eyelashes {
	od: string;
	os: string;
}

export interface Eyebrows {
	od: string;
	os: string;
}

export interface Cornea {
	od: string;
	os: string;
}

export interface Sclera {
	od: string;
	os: string;
}

export interface Iris {
	od: string;
	os: string;
}

export interface Pupil {
	od: string;
	os: string;
}

export interface Lensmedia {
	od: string;
	os: string;
}

export interface Conjunctiva {
	od: string;
	os: string;
}

export interface BulbarConjunctiva {
	od: string;
	os: string;
}

export interface Palpebral {
	od: string;
	os: string;
}

export interface PalpebralFissure {
	od: string;
	os: string;
}

export interface AnteriorChamber {
	od: string;
	os: string;
}

export interface Ophthalmoscopy {
	avcrossing: Avcrossing;
	avratio: Avratio;
	cdratio: Cdratio;
	fovealReflex: FovealReflex;
	instrumentsUsed: string;
	macula: Macula;
	otherObservation: string;
	brucknerTest: {
		od: string;
		os: string;
		notes: string;
	};
	periphery: Periphery;
	ror: Ror;
	venousPulsation: VenousPulsation;
	isComplete: boolean;
	_id: string;
	createdAt: string;
	updatedAt: string;
}

export interface Avcrossing {
	od: string;
	os: string;
	_id: string;
}

export interface Avratio {
	od: string;
	os: string;
	_id: string;
}

export interface Cdratio {
	od: string;
	os: string;
	_id: string;
}

export interface FovealReflex {
	od: string;
	os: string;
	_id: string;
}

export interface Macula {
	od: string;
	os: string;
	_id: string;
}

export interface Periphery {
	od: string;
	os: string;
	_id: string;
}

export interface Ror {
	od: string;
	os: string;
	_id: string;
}

export interface VenousPulsation {
	od: string;
	os: string;
	_id: string;
}

export interface ModuleId {
	_id: string;
	name: string;
	acronym: string;
	imageUrl: string;
	createdBy: string;
	members: Member[];
	createdAt: string;
	updatedAt: string;
	__v: number;
	submissions: any[];
}

export interface Member {
	id: string;
	addedDate: string;
	submissions: string[];
	_id: string;
}
