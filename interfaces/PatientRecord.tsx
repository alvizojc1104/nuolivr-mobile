// Basic interfaces
interface ContactInformation {
      mobile: string
      emailAddress: string
      fullAddress: string
}

interface Address {
      baranggay: string
      city: string
      street: string
      province: string
}

// Patient related interfaces
interface PatientId {
      contactInformation: ContactInformation
      _id: string
      imageUrl: string
      firstName: string
      middleName: string
      lastName: string
      birthdate: string
      occupationOrCourse: string
      hobbiesOrAvocation: string
      gender: string
      civilStatus: string
      age: number
      records: string[]
      addedBy: string
      createdAt: string
      updatedAt: string
      patient_id: string
      __v: number
}

// Eye Triage interface
interface EyeTriage {
      flashes: string
      flashesStarted: string
      hasFlashesOrFloaters: string
      hasRecentIllnesses: string
      isExperiencingPainItchingDiscomfort: string
      isExperiencingSymptoms: string
      isExposedToChemicalIrritantsAllergens: string
      symptomBegins: string
      symptomsSpecified: string
      isComplete: boolean
      _id: string
      createdAt: string
      updatedAt: string
}

// Patient Case Record interfaces
interface ChiefComplaints {
      nonVisualComplaints: string[]
      visualComplaints: string[]
}

interface ContactLensHistory {
      contactLensBrand: string
      contactLensDosage: string
      contactLensDuration: string
      contactLensFrequency: string
      contactLensPrescription: string
      contactLensType: string
      usesEyedrop: string
      usingOrWearingContactLens: string
}

interface FamilyOcularAndHealthHistory {
      history: string[]
      other: string
}

interface InitialObservation {
      facialSymmetry: string
      headPosition: string
      odor: string
      patientGait: string
      skinColor: string
      speech: string
}

interface MedicalHistory {
      hypersensitivy: string
      medicalAllergies: string
      medicalDosage: string
      medicalDuration: string
      medicineType: string
}

interface OcularHistory {
      majorIllness: string
      majorProblems: string
      previousEyeSurgery: string
      similarProblemBefore: string
}

interface SocialHistory {
      socialHistory: string[]
      socialHistoryDuration: string
}

interface SpectacleHistory {
      spectacleDuration: string
      spectacleFrequency: string
      spectaclePrescription: string
      usingOrWearingSpectacle: string
}

interface PatientCaseRecord {
      chiefComplaints: ChiefComplaints
      contactLensHistory: ContactLensHistory
      familyOcularAndHealthHistory: FamilyOcularAndHealthHistory
      initialObservation: InitialObservation
      medicalHistory: MedicalHistory
      ocularHistory: OcularHistory
      socialHistory: SocialHistory
      spectacleHistory: SpectacleHistory
      isComplete: boolean
      _id: string
      createdAt: string
      updatedAt: string
}

// Preliminary Examination interfaces
interface PupillaryDistance {
      monocular: {
            OD: string
            OS: string
      }
      binocular: {
            near: string
            far: string
      }
}

interface OcularDominance {
      dominantEye: string
      dominantHand: string
      note: string
}

interface CornealReflex {
      note: string
}

interface PupillaryFunction {
      direct: string
      indirect: string
}

interface Perrla {
      eod: string
      eos: string
      lod: string
      los: string
      aod: string
      aos: string
}

interface CoverTest {
      unilateral: {
            far: {
                  od: string
                  os: string
            }
            near: {
                  od: string
                  os: string
            }
      }
      alternate: {
            far: {
                  od: string
                  os: string
            }
            near: {
                  od: string
                  os: string
            }
      }
}

interface MotilityTest {
      version: {
            broadH: string
            saccades: string
            pursuit: string
      }
      duction: {
            od: string
            os: string
      }
      note: string
}

interface StereoptyTest {
      stereopsis: string
}

interface ColorVision {
      ishihara: {
            od: string
            os: string
      }
}

interface OcularMotility {
      od: string
      os: string
}

interface NearPointAccomodation {
      od: {
            trial1: string
            trial2: string
            trial3: string
      }
      os: {
            trial1: string
            trial2: string
            trial3: string
      }
      ou: {
            trial1: string
            trial2: string
            trial3: string
      }
}

interface NearPointConvergence {
      ou: {
            trial1: string
            trial2: string
            trial3: string
      }
}

interface PreliminaryExamination {
      pupillaryDistance: PupillaryDistance
      ocularDominance: OcularDominance
      cornealReflex: CornealReflex
      pupillaryFunction: PupillaryFunction
      perrla: Perrla
      coverTest: CoverTest
      motilityTest: MotilityTest
      stereoptyTest: StereoptyTest
      colorVision: ColorVision
      ocularMotility: OcularMotility
      nearPointAccomodation: NearPointAccomodation
      nearPointConvergence: NearPointConvergence
      physiologicDiplopia: string
      subjectiveOrObjective: string
      cornealReflexImgUrl: string
      isComplete: boolean
      _id: string
      createdAt: string
      updatedAt: string
}

// External Eye Examination interface
interface ExternalEyeExamination {
      eyelid: { od: string; os: string }
      eyelashes: { od: string; os: string }
      eyebrows: { od: string; os: string }
      cornea: { od: string; os: string }
      sclera: { od: string; os: string }
      iris: { od: string; os: string }
      pupil: { od: string; os: string }
      lensmedia: { od: string; os: string }
      conjunctiva: { od: string; os: string }
      bulbarConjunctiva: { od: string; os: string }
      palpebral: { od: string; os: string }
      palpebralFissure: { od: string; os: string }
      anteriorChamber: { od: string; os: string }
      isComplete: boolean
      instrumentsUsed: string
      otherObservation: string
      _id: string
      createdAt: string
      updatedAt: string
}

// Ophthalmoscopy interface
interface Ophthalmoscopy {
      avcrossing: { od: string; os: string; _id: string }
      avratio: { od: string; os: string; _id: string }
      cdratio: { od: string; os: string; _id: string }
      fovealReflex: { od: string; os: string; _id: string }
      instrumentsUsed: string
      macula: { od: string; os: string; _id: string }
      otherObservation: string
      periphery: { od: string; os: string; _id: string }
      ror: { od: string; os: string; _id: string }
      venousPulsation: { od: string; os: string; _id: string }
      isComplete: boolean
      _id: string
      createdAt: string
      updatedAt: string
}

// Visual Acuity interface
interface VisualAcuity {
      aided: {
            distance: { od: string; os: string; ou: string }
            near: { od: string; os: string; ou: string }
            note: string
      }
      pinhole: {
            OD: string
            OS: string
            note: string
      }
      refraction: {
            od: { dcylx: string; dsph: string; od: string; va: string }
            os: { dcylx: string; dsph: string; os: string; va: string }
            add: string
            autorefractometer: string
            finalRx: string
            modifications: string
      }
      unaided: {
            distance: { od: string; os: string; ou: string }
            near: { od: string; os: string; ou: string }
            note: string
      }
      isComplete: boolean
      _id: string
      createdAt: string
      updatedAt: string
}

// Phorometry interface
interface Phorometry {
      phoria: {
            distance: {
                  horizontalvt3: string
                  vt8: string
                  verticalvt12: string
            }
            near: {
                  horizontalvt13a: string
                  vt13b: string
                  verticalvt18: string
            }
      }
      duction: {
            distance: {
                  sbdod: string
                  sbdos: string
                  lbuod: string
                  lbuos: string
            }
            near: {
                  sbdod: string
                  sbdos: string
                  lbuod: string
                  lbuos: string
            }
      }
      vergence: {
            distance: {
                  bovt9: string
                  vt10: string
                  bivt11: string
            }
            near: {
                  bovt16a: string
                  vt16b: string
                  bivt17a: string
                  vt17b: string
            }
      }
      crossCylinder: {
            distance: {
                  dissociatedOD: string
                  phoriaOD: string
            }
            near: {
                  binocularOD: string
                  phoriaOS: string
            }
      }
      accomodativeTest: {
            aoa: {
                  od: string
                  os: string
                  ou: string
            }
            pra: string
            nra: string
            gradientAcaRatio: string
            calculatedAcaRatio: string
            hoffstetersFormula: string
      }
      isComplete: boolean
      _id: string
      createdAt: string
      updatedAt: string
}

// Clinician interface
interface Clinician {
      address: Address
      _id: string
      studentOrFacultyID: string
      userId: string
      imageUrl: string
      emailAddress: string
      password: string | null
      firstName: string
      middleName: string
      lastName: string
      birthdate: string | null
      gender: string
      phoneNumber: string
      role: string
      patients: string[]
      created_at: string
      updated_at: string
      __v: number
      birthday: string
      fullName: string
}

// Main EyeExamReport interface
export interface EyeExamReport {
      _id: string
      patientId: PatientId
      clinicianId: string
      eyeTriage: EyeTriage
      patientCaseRecord: PatientCaseRecord
      preliminaryExamination: PreliminaryExamination
      createdAt: string
      updatedAt: string
      __v: number
      externalEyeExamination: ExternalEyeExamination
      ophthalmoscopy: Ophthalmoscopy
      visualAcuity: VisualAcuity
      phorometry: Phorometry
      clinician: Clinician
}

export type { Ophthalmoscopy }

