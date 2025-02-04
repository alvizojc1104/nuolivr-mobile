export type ContactInformation = {
      mobile: string;
      emailAddress: string;
      fullAddress: string;
};

export type Patient = {
      _id: string;
      contactInformation: ContactInformation;
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
      records: string[];
      addedBy: string;
      createdAt: string;
      updatedAt: string;
      patient_id: string;
};

export type Clinician = {
      _id: string;
      studentOrFacultyID: string;
      userId: string;
      imageUrl: string;
      emailAddress: string;
      firstName: string;
      middleName: string;
      lastName: string;
      gender: string;
      phoneNumber: string;
      role: string;
      patients: string[];
      created_at: string;
      updated_at: string;
      fullName: string;
};

export type EyeTriage = {
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
};

export type PatientCaseRecord = {
      chiefComplaints: Record<string, string[]>;
      contactLensHistory: Record<string, string>;
      familyOcularAndHealthHistory: Record<string, any>;
      initialObservation: Record<string, string>;
      medicalHistory: Record<string, string>;
      ocularHistory: Record<string, string>;
      socialHistory: Record<string, any>;
      spectacleHistory: Record<string, string>;
      isComplete: boolean;
      _id: string;
      createdAt: string;
      updatedAt: string;
};

export type VisualAcuity = Record<string, any>;
export type Phorometry = Record<string, any>;
export type ExternalEyeExamination = Record<string, any>;
export type Ophthalmoscopy = Record<string, any>;

export type PatientRecord = {
      _id: string;
      patientId: Patient;
      clinicianId: string;
      clinician: Clinician;
      eyeTriage: EyeTriage;
      patientCaseRecord: PatientCaseRecord;
      visualAcuity: VisualAcuity;
      phorometry: Phorometry;
      externalEyeExamination: ExternalEyeExamination;
      ophthalmoscopy: Ophthalmoscopy;
      createdAt: string;
      updatedAt: string;
};
