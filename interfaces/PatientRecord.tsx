export interface PatientRecord {
      _id: string;
      patientId: string;
      clinicianId: string;
      eyeTriage: EyeTriage;
      patientCaseRecord: PatientCaseRecord;
      preliminaryExamination: PreliminaryExamination;
      externalEyeExamination: ExternalEyeExamination;
      ophthalmoscopy: Ophthalmoscopy;
      visualAcuity: VisualAcuity;
      phorometry: Phorometry;
      createdAt: string;
      updatedAt: string;
      __v: number;
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
      chiefComplaints: {
            nonVisualComplaints: string[];
            visualComplaints: string[];
      };
      contactLensHistory: {
            contactLensBrand: string;
            contactLensDosage: string;
            contactLensDuration: string;
            contactLensFrequency: string;
            contactLensPrescription: string;
            contactLensType: string;
            usesEyedrop: string;
            usingOrWearingContactLens: string;
      };
      familyOcularAndHealthHistory: {
            history: string[];
            other: string;
      };
      initialObservation: {
            facialSymmetry: string;
            headPosition: string;
            odor: string;
            patientGait: string;
            skinColor: string;
            speech: string;
      };
      medicalHistory: {
            hypersensitivy: string;
            medicalAllergies: string;
            medicalDosage: string;
            medicalDuration: string;
            medicineType: string;
      };
      ocularHistory: {
            majorIllness: string;
            majorProblems: string;
            previousEyeSurgery: string;
            similarProblemBefore: string;
      };
      socialHistory: {
            socialHistory: string[];
            socialHistoryDuration: string;
      };
      spectacleHistory: {
            spectacleDuration: string;
            spectacleFrequency: string;
            spectaclePrescription: string;
            usingOrWearingSpectacle: string;
      };
      isComplete: boolean;
      _id: string;
      createdAt: string;
      updatedAt: string;
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
      pupillaryFunction: {
            direct: string;
            indirect: string;
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
      ocularMotility: {
            od: string;
            os: string;
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
      physiologicDiplopia: string;
      subjectiveOrObjective: string;
      cornealReflexImgUrl: string;
      isComplete: boolean;
      _id: string;
      createdAt: string;
      updatedAt: string;
}

export interface ExternalEyeExamination {
      eyelid: {
            od: string;
            os: string;
      };
      eyelashes: {
            od: string;
            os: string;
      };
      eyebrows: {
            od: string;
            os: string;
      };
      cornea: {
            od: string;
            os: string;
      };
      sclera: {
            od: string;
            os: string;
      };
      iris: {
            od: string;
            os: string;
      };
      pupil: {
            od: string;
            os: string;
      };
      lensmedia: {
            od: string;
            os: string;
      };
      conjunctiva: {
            od: string;
            os: string;
      };
      bulbarConjunctiva: {
            od: string;
            os: string;
      };
      palpebral: {
            od: string;
            os: string;
      };
      palpebralFissure: {
            od: string;
            os: string;
      };
      anteriorChamber: {
            od: string;
            os: string;
      };
      isComplete: boolean;
      instrumentsUsed: string;
      otherObservation: string;
      _id: string;
      createdAt: string;
      updatedAt: string;
}

export interface Ophthalmoscopy {
      avcrossing: {
            od: string;
            os: string;
            _id: string;
      };
      avratio: {
            od: string;
            os: string;
            _id: string;
      };
      cdratio: {
            od: string;
            os: string;
            _id: string;
      };
      fovealReflex: {
            od: string;
            os: string;
            _id: string;
      };
      instrumentsUsed: string;
      macula: {
            od: string;
            os: string;
            _id: string;
      };
      otherObservation: string;
      periphery: {
            od: string;
            os: string;
            _id: string;
      };
      ror: {
            od: string;
            os: string;
            _id: string;
      };
      venousPulsation: {
            od: string;
            os: string;
            _id: string;
      };
      isComplete: boolean;
      _id: string;
      createdAt: string;
      updatedAt: string;
}

export interface VisualAcuity {
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
            add: string;
            autorefractometer: string;
            finalRx: string;
            modifications: string;
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
      isComplete: boolean;
      _id: string;
      createdAt: string;
      updatedAt: string;
}

export interface Phorometry {
      phoria: {
            distance: {
                  horizontalvt3: string;
                  vt8: string;
                  verticalvt12: string;
            };
            near: {
                  horizontalvt13a: string;
                  vt13b: string;
                  verticalvt18: string;
            };
      };
      duction: {
            distance: {
                  sbdod: string;
                  sbdos: string;
                  lbuod: string;
                  lbuos: string;
            };
            near: {
                  sbdod: string;
                  sbdos: string;
                  lbuod: string;
                  lbuos: string;
            };
      };
      vergence: {
            distance: {
                  bovt9: string;
                  vt10: string;
                  bivt11: string;
            };
            near: {
                  bovt16a: string;
                  vt16b: string;
                  bivt17a: string;
                  vt17b: string;
            };
      };
      crossCylinder: {
            distance: {
                  dissociatedOD: string;
                  phoriaOD: string;
            };
            near: {
                  binocularOD: string;
                  phoriaOS: string;
            };
      };
      accomodativeTest: {
            aoa: {
                  od: string;
                  os: string;
                  ou: string;
            };
            pra: string;
            nra: string;
            gradientAcaRatio: string;
            calculatedAcaRatio: string;
            hoffstetersFormula: string;
      };
      isComplete: boolean;
      _id: string;
      createdAt: string;
      updatedAt: string;
}