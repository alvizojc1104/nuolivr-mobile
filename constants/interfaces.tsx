export interface PatientCaseRecord {
    initialObservation: {
        facialSymmetry: string; // using camelCase for consistency
        patientGait: string; // using camelCase for consistency
        headPosition: string; // using camelCase for consistency
        odor: string;
        speech: string;
        skinColor: string;
    };
    chiefComplaints: {
        visualComplaints: string[];
        nonVisualComplaints: string[];
    },
    ocularHistory: {
        similarProblemBefore: string;
        majorIllness: string;
        previousEyeSurgery: string;
        majorProblems: string;
    };
    spectacleHistory: {
        usingOrWearingSpectacle: string; // assuming this is a string to indicate 'yes' or 'no'
        spectaclePrescription: string;
        spectacleDuration: string;
        spectacleFrequency: string;
    };
    contactLensHistory: {
        usingOrWearingContactLens: string; // assuming this is a string to indicate 'yes' or 'no'
        contactLensPrescription: string;
        contactLensDuration: string;
        contactLensFrequency: string;
        contactLensBrand: string;
        contactLensType: string;
        usesEyedrop: string; // assuming this is a string to indicate 'yes' or 'no'
        contactLensDosage: string;

    };
    medicalHistory: {
        medicineType: string;
        medicalDuration: string;
        medicalDosage: string;
        medicalAllergies: string;
        hypersensitivity: string; // corrected from "ypersensitivy"

    }
    familyOcularAndHealthHistory: {
        history: string[];
        other: string
    }
    socialHistory: {
        socialHistory: string[];
        socialHistoryDuration: string;
    }
}

export interface PreliminaryExamination {
    pupillaryDistance: {
        monocular: {
            OD: string;
            OS: string;
        };
        binocular: {
            near: string;
            far: string;
        };
    };
    ocularDominance: {
        dominantEye: string;
        dominantHand: string;
        note: string;
    };
    cornealReflex: {
        note: string;
    };
    cornealReflexImgUrl: string | null;
    physiologicDiplopia: string;
    pupillaryFunction: {
        direct: string;
        indirect: string;
        Notes: string;
    };
    perrla: {
        eod: string;
        eos: string;
        lod: string;
        los: string;
        aod: string;
        aos: string;
    };
    coverTest: {
        unilateral: {
            far: {
                od: string;
                os: string;
            };
            near: {
                od: string;
                os: string;
            };
        };
        alternate: {
            far: {
                od: string;
                os: string;
            };
            near: {
                od: string;
                os: string;
            };
        };
        note: string;
    };
    motilityTest: {
        version: {
            broadH: string;
            saccades: string;
            pursuit: string;
        };
        duction: {
            od: string;
            os: string;
        };
        note: string;
    };
    stereoptyTest: {
        stereopsis: string;
    };
    colorVision: {
        ishihara: {
            od: string;
            os: string;
        };
    };
    nearPointAccomodation: {
        od: {
            trial1: string;
            trial2: string;
            trial3: string;
        };
        os: {
            trial1: string;
            trial2: string;
            trial3: string;
        };
        ou: {
            trial1: string;
            trial2: string;
            trial3: string;
        };
    };
    nearPointConvergence: {
        ou: {
            trial1: string;
            trial2: string;
            trial3: string;
        };
    };
    subjectiveOrObjective: string;
}

export interface EyeTriage {
    _id: string;
    flashes: string;
    flashesStarted: string;
    hasFlashesOrFloaters: 'yes' | 'no';
    hasRecentIllnesses: 'yes' | 'no';
    isExperiencingPainItchingDiscomfort: 'yes' | 'no';
    isExperiencingSymptoms: 'yes' | 'no';
    isExposedToChemicalIrritantsAllergens: 'yes' | 'no';
    symptomBegins: string;
    symptomsSpecified: string;
}

export interface VisualAcuityForm {
    aided: {
        distance: {
            od: string;
            os: string;
            ou: string;
        };
        near: {
            od: string;
            os: string;
            ou: string;
        };
        note: string;
    };
    pinhole: {
        OD: string;
        OS: string;
        note: string;
    };
    refraction: {
        add: string;
        autorefractometer: string;
        finalRx: string;
        modifications: string;
        od: {
            dcylx: string;
            dsph: string;
            od: string;
            va: string;
        };
        os: {
            dcylx: string;
            dsph: string;
            os: string;
            va: string;
        };
    };
    unaided: {
        distance: {
            od: string;
            os: string;
            ou: string;
        };
        near: {
            od: string;
            os: string;
            ou: string;
        };
        note: string;
    };
}

export type PatientRecord = {
    patient_id: string;
    clinician_id: string;
    eyeTriage?: EyeTriage,
    patientCaseRecord?: PatientCaseRecord,
    preliminaryExamination?: PreliminaryExamination;
    visualAcuityForm?: VisualAcuityForm;
}