import { EyeExamReport as IEyeExamReport  } from "@/interfaces/PatientRecord";
const EyeExamReport = (data: IEyeExamReport) => {
  return `
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Eye Examination Report</title>
      <style>
        @page {
          size: A4;
          margin: 4rem;
        }
  
        body {
          font-family: Arial, sans-serif;
          font-size: 8pt;
          line-height: 1.2;
          margin: 0;
          box-sizing: border-box;
        }
  
        .patient-image {
          width: 80pt;
          height: 80pt;
          object-fit: contain;
        }
  
        .logo {
          width: 70px;
          height: 70px;
        }
  
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 7pt;
        }
        th,
        td {
          border: .5px solid #ddd;
          padding: 3px;
          text-align: left;
          vertical-align: middle;
        }
        th {
          background-color: #f2f2f2;
        }
  
        .center{
          text-align: center;
        }
  
        .keys {
          width: fit-content;
        }
  
        .flex {
          display: flex;
        }
  
        .flex-col{
          flex-direction: column;
        }
  
        .justify-center {
          justify-content: center;
        }
  
        .items-start {
          align-items: flex-start;
        }
  
        .text-center {
          text-align: center;
        }
  
        .mb-4{
          margin-bottom: 1rem;
        }
  
        .font-bold {
          font-weight: bold;
        }
  
        .font-semibold {
          font-weight:bold;
        }
  
        .bg-gray-200 {
          background-color: #f2f2f2;
        }
  
        .mb-2{
          margin-bottom: .5rem;
        }
  
        .mt-2 {
          margin-top: .5rem;
        }
  
        .gap-2{
          gap: .5rem;
        }
  
        .header-title{
          line-height: .5;
          font-size: 9pt;
        }
  
        header{
          display: flex;
          width: 100%;
          justify-content: space-between;
        }
  
        .content {
          text-align: start;
          vertical-align: text-top;
        }
      </style>
    </head>
    <body>
      <header>
        <div class="flex flex-row align w-full justify-start gap-4 items-center">
          <img
            src="https://national-u.edu.ph/wp-content/uploads/2018/12/cropped-NU-Shield_FC_RGB_POS_AW.png"
            alt="National University Logo"
            class="logo"
          />
          <div class="header-title">
            <p class="font-bold">National University - Mall of Asia</p>
            <p>School of Optometry</p>
            <p>Coral Way, Pasay, Metro Manila</p>
          </div>
        </div>
        <img
          class="patient-image"
          src="${data.patientId.imageUrl}"
          alt="patient photo"
          srcset="patient photo"
        />
      </header>
      <main>
        <p class="text-center mb-4 font-bold header-title">Patient Case Record</p>
        <section class="flex gap-2">
          <table>
            <tr>
              <th colspan="2">PATIENT</th>
            </tr>
            <tr>
              <td class="keys">Name:</td>
              <td>${data.patientId.firstName} ${data.patientId.middleName} ${
    data.patientId.lastName
  }</td>
            </tr>
            <tr>
              <td class="keys">Patient ID:</td>
              <td>${data.patientId.patient_id}</td>
            </tr>
            <tr>
              <td class="keys">Age:</td>
              <td>${data.patientId.age}</td>
            </tr>
            <tr>
              <td class="keys" colspan="1">Gender:</td>
              <td>${data.patientId.gender}</td>
            </tr>
            <tr>
              <td class="keys">Occupation:</td>
              <td>${data.patientId.occupationOrCourse}</td>
            </tr>
            <tr>
              <td class="keys">Contact:</td>
              <td>${data.patientId.contactInformation.mobile}</td>
            </tr>
            <tr>
              <td class="keys">Email:</td>
              <td>${data.patientId.contactInformation.emailAddress}</td>
            </tr>
          </table>
          <table>
            <tr>
              <th colspan="2">CLINICIAN</th>
            </tr>
            <tr>
              <td class="keys">Name:</td>
              <td>${data.clinician.firstName} ${data.clinician.middleName} ${
    data.clinician.lastName
  }</td>
            </tr>
            <tr>
              <td class="keys">Position:</td>
              <td>${data.clinician.role}</td>
            </tr>
            <tr>
              <td class="keys">Student ID:</td>
              <td>${data.clinician.studentOrFacultyID}</td>
            </tr>
            <tr>
              <td class="keys">Email Address:</td>
              <td>${data.clinician.emailAddress}</td>
            </tr>
            <tr>
              <td class="keys">Mobile No.</td>
              <td>${data.clinician.phoneNumber}</td>
            </tr>
            <tr>
              <td class="keys">Date Examined:</td>
              <td>${new Date(data.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</td>
            </tr>
          </table>
        </section>
        <section class="mt-2">
          <p class="font-semibold mb-2 w-full bg-gray-200 mt-2 text-center">
            EYE TRIAGE
          </p>
          <section class="flex gap-2">
            <table class="flex-2">
              <tr>
                <th>SYMPTOM</th>
                <th>Status</th>
              </tr>
              <tr>
                <td>Experiencing Symptoms</td>
                <td>${data.eyeTriage.isExperiencingSymptoms}</td>
              </tr>
              <tr>
                <td>Pain/Itching/Discomfort</td>
                <td>${data.eyeTriage.isExperiencingPainItchingDiscomfort}</td>
              </tr>
              <tr>
                <td>Flashes or Floaters</td>
                <td>${data.eyeTriage.hasFlashesOrFloaters}</td>
              </tr>
              <tr>
                <td>Recent Illnesses</td>
                <td>${data.eyeTriage.hasRecentIllnesses}</td>
              </tr>
              <tr>
                <td>Exposed to Chemical Irritants/Allergens</td>
                <td>${data.eyeTriage.isExposedToChemicalIrritantsAllergens}</td>
              </tr>
            </table>
          </section>
          <section>
            <p class="font-semibold mb-2 w-full bg-gray-200 mt-2 text-center">
              PRELIMINARY EXAMINATION
            </p>
            <table class="flex-4">
              <tr>
                <th colspan="1" class="w-[10%]">INITIAL OBSERVATION</th>
                <th colspan="1" class="w-[20%]">Details</th>
                <th class="w-[30%]">MEDICAL HISTORY</th>
                <th class="w-[20%]">Details</th>
              </tr>
              <tr>
                <td>Facial Symmetry</td>
                <td>${
                  data.patientCaseRecord.initialObservation.facialSymmetry
                }</td>
                <td>Hypersensitivity</td>
                <td>${data.patientCaseRecord.medicalHistory.hypersensitivy}</td>
              </tr>
              <tr>
                <td>Head Position</td>
                <td>${
                  data.patientCaseRecord.initialObservation.headPosition
                }</td>
                <td>Medical Allergies</td>
                <td>${
                  data.patientCaseRecord.medicalHistory.medicalAllergies
                }</td>
              </tr>
              <tr>
                <td>Odor</td>
                <td>${data.patientCaseRecord.initialObservation.odor}</td>
                <td>Medical Dosage</td>
                <td>${data.patientCaseRecord.medicalHistory.medicalDosage}</td>
              </tr>
              <tr>
                <td>Patient Gait</td>
                <td>${
                  data.patientCaseRecord.initialObservation.patientGait
                }</td>
                <td>Medical Duration</td>
                <td>${
                  data.patientCaseRecord.medicalHistory.medicalDuration
                }</td>
              </tr>
              <tr>
                <td>Skin Color</td>
                <td>${data.patientCaseRecord.initialObservation.skinColor}</td>
                <td>Medicine Type</td>
                <td>${data.patientCaseRecord.medicalHistory.medicineType}</td>
              </tr>
              <tr>
                <td>Speech</td>
                <td>${data.patientCaseRecord.initialObservation.speech}</td>
                <td colspan="2"></td>
              </tr>
              <tr>
                  <TH COLSPAN="1">COMPLAINTS/HISTORY</TH>
                <th colspan="3">Details</th>
              </tr>
              <tr>
                <td>Visual Complaints</td>
                <td colspan="3">${data.patientCaseRecord.chiefComplaints.visualComplaints.join(
                  ", "
                )}</td>
              </tr>
              <tr>
                <td>Non-Visual Complaints</td>
                <td colspan="3">${data.patientCaseRecord.chiefComplaints.nonVisualComplaints.join(
                  ", "
                )}</td>
              </tr>
              <tr>
                <td>Family Ocular History</td>
                <td colspan="3">${data.patientCaseRecord.familyOcularAndHealthHistory.history.join(
                  ", "
                )}</td>
              </tr>
              <tr>
                <td>Social History</td>
                <td colspan="3">${data.patientCaseRecord.socialHistory.socialHistory.join(
                  ", "
                )} (Duration: ${
    data.patientCaseRecord.socialHistory.socialHistoryDuration
  })</td>
              </tr>
              <tr>
                  <TH COLSPAN="4">CONTACT LENS HISTORY</TH>
              </tr>
              <tr>
                <td colspan="1" class="w-[20%]">Brand</td>
                <td colspan="1">${
                  data.patientCaseRecord.contactLensHistory.contactLensBrand
                }</td>
                <td colspan="1" class="w-[20%]">Prescription</td>
                <td colspan="1">${
                  data.patientCaseRecord.contactLensHistory
                    .contactLensPrescription
                }</td>
              </tr>
              <tr>
                <td>Dosage</td>
                <td>${
                  data.patientCaseRecord.contactLensHistory.contactLensDosage
                }</td>
                <td>Type</td>
                <td>${
                  data.patientCaseRecord.contactLensHistory.contactLensType
                }</td>
              </tr>
              <tr>
                <td>Duration</td>
                <td>${
                  data.patientCaseRecord.contactLensHistory.contactLensDuration
                }</td>
                <td>Uses Eyedrop</td>
                <td>${
                  data.patientCaseRecord.contactLensHistory.usesEyedrop
                }</td>
              </tr>
              <tr>
                <td>Frequency</td>
                <td>${
                  data.patientCaseRecord.contactLensHistory.contactLensFrequency
                }</td>
                <td>Using or Wearing Contact Lens</td>
                <td>${
                  data.patientCaseRecord.contactLensHistory
                    .usingOrWearingContactLens
                }</td>
              </tr>
            <tr>
              <TH COLSPAN="4">SPECTACLE HISTORY</TH>
            </tr>
            <tr>
              <td colspan="1" class="w-[30%] border-top-0">Duration</td>
              <td colspan="3">${
                data.patientCaseRecord.spectacleHistory.spectacleDuration
              }</td>
            </tr>
            <tr>
              <td>Frequency</td>
              <td colspan="3">${
                data.patientCaseRecord.spectacleHistory.spectacleFrequency
              }</td>
            </tr>
            <tr>
              <td>Prescription</td>
              <td colspan="3">${
                data.patientCaseRecord.spectacleHistory.spectaclePrescription
              }</td>
            </tr>
            <tr>
              <td>Using or Wearing Spectacle</td>
              <td colspan="3">${
                data.patientCaseRecord.spectacleHistory.usingOrWearingSpectacle
              }</td>
            </tr>
          </table>
        </section>
        <section class="mt-2">
          <table>
            <tr>
              <TH COLSPAN="3">PUPILLARY DISTANCE</TH>
            </tr>
            <tr>
              <td class="w-[30]%" rowspan="2">Monocular</td>
              <th  class="w-[35%] font-semibold">Right (OD)</th>
              <th class="w-[35%] font-semibold">Left (OS)</th>
            </tr>
            <tr>
              <td  class="w-[35%]">${
                data.preliminaryExamination.pupillaryDistance.monocular.OD
              }</td>
              <td class="w-[35%]">${
                data.preliminaryExamination.pupillaryDistance.monocular.OS
              }</td>
            </tr>
            <tr>
              <td class="w-[50]%" rowspan="2">Binocular</td>
              <th class="w-[35%] font-semibold">Far</th>
              <th  class="w-[35%] font-semibold">Near</th>
            </tr>
            <tr>
              <td class="w-[35%]">${
                data.preliminaryExamination.pupillaryDistance.binocular.far
              }</td>
              <td  class="w-[35%]">${
                data.preliminaryExamination.pupillaryDistance.binocular.near
              }</td>
            </tr>
            <tr>
              <TH>OCULAR DOMINANCE</TH>
              <th  class="w-[35%] font-semibold">Right (OD)</th>
              <th class="w-[35%] font-semibold">Left (OS)</th>
            </tr>
            <tr>
              <td>Dominant Eye</td>
              <td>${
                data.preliminaryExamination.ocularDominance.dominantEye === "OD"
                  ? "domod"
                  : ""
              }</td>
              <td>${
                data.preliminaryExamination.ocularDominance.dominantEye === "OS"
                  ? "domos"
                  : ""
              }</td>
            </tr>
            <tr>
              <td>Dominant Hand</td>
              <td>${
                data.preliminaryExamination.ocularDominance.dominantHand ===
                "right"
                  ? "hand right"
                  : ""
              }</td>
              <td>${
                data.preliminaryExamination.ocularDominance.dominantHand ===
                "left"
                  ? "hand left"
                  : ""
              }</td>
            </tr>
            <tr>
              <td class="h-[20pt]" colspan="3" rowspan="2">Notes: ${
                data.preliminaryExamination.ocularDominance.note
              } </td>
            </tr>
          </table>
          <table class="mt-2">
            <tr>
              <th colspan="3">CORNEAL REFLEX</th>
            </tr>
            <tr>
              <td class="text-center">OD</td>
              <td class="text-center">OS</td>
              <td class="text-center" style="width: 50%;">Notes</td>
            </tr>
            <tr>
              <td class="text-center">
                <img src="${
                  data.preliminaryExamination.cornealReflexImgUrl
                }" alt="Corneal Reflex OD" class="logo"/>
              </td>
              <td class="text-center">
                <img src="${
                  data.preliminaryExamination.cornealReflexImgUrl
                }" alt="Corneal Reflex OS" class="logo"/>
              </td>
              <td style="text-align:start; vertical-align: top;">${
                data.preliminaryExamination.cornealReflex.note
              }</td>
            </tr>
          </table>
          <p class="my-4 font-semibold">Physiologic Diplopia: ${
            data.preliminaryExamination.physiologicDiplopia
          } </p>
          <table>
            <tr>
              <th rowspan="2" colspan="1">COVER TEST</th>
              <th class="center" colspan="2">Far</th>
              <th class="center" colspan="2">Near</th>
            </tr>
            <tr>
              <th class="center">OD</th>
              <th class="center">OS</th>
              <th class="center">OD</th>
              <th class="center">OS</th>
            </tr>
            <tr>
              <td>Unilateral</td>
              <td class="center">${
                data.preliminaryExamination.coverTest.unilateral.far.od
              }</td>
              <td class="center">${
                data.preliminaryExamination.coverTest.unilateral.far.os
              }</td>
              <td class="center">${
                data.preliminaryExamination.coverTest.unilateral.near.od
              }</td>
              <td class="center">${
                data.preliminaryExamination.coverTest.unilateral.near.os
              }</td>
            </tr>
            <tr>
              <td>Alternate</td>
              <td class="center">${
                data.preliminaryExamination.coverTest.alternate.far.od
              }</td>
              <td class="center">${
                data.preliminaryExamination.coverTest.alternate.far.os
              }</td>
              <td class="center">${
                data.preliminaryExamination.coverTest.alternate.near.od
              }</td>
              <td class="center">${
                data.preliminaryExamination.coverTest.alternate.near.os
              }</td>
            </tr>
          </table>
  
          <table class="mt-2">
            <tr>
              <th colspan="3" class="text-center">PUPILLARY FUNCTION</th>
            </tr>
            <tr>
              <th class="text-center">Direct</th>
              <th class="text-center">Indirect</th>
              <th class="text-center">Notes</th>
            </tr>
            <tr>
              <td class="text-center">${
                data.preliminaryExamination.pupillaryFunction.direct
              }</td>
              <td class="text-center">${
                data.preliminaryExamination.pupillaryFunction.indirect
              }</td>
              <td class="text-center"></td>
            </tr>
          </table>
        </section>
        <section class="flex justify-between gap-2 mt-2">
          <table style="width: 200%;">
            <tr>
              <th colspan="2">OCULAR MOTILITY</th>
            </tr>
            <tr>
              <td class="text-center">OD</td>
              <td class="text-center">OS</td>
            </tr>
            <tr>
              <td class="text-center">
                <img src="${
                  data.preliminaryExamination.ocularMotility.od
                }" alt="Ocular Motility OD" class="logo"/>
              </td>
              <td class="text-center">
                <img src="${
                  data.preliminaryExamination.ocularMotility.os
                }" alt="Ocular Motility OS" class="logo"/>
              </td>
            </tr>
          </table>
          <table>
            <tr>
              <th>MOTILITY TEST</th>
            </tr>
            <tr>
              <td class="content">• Broad H: ${
                data.preliminaryExamination.motilityTest.version.broadH
              }<br /><br />• Saccades: ${
    data.preliminaryExamination.motilityTest.version.saccades
  } <br/><br />• Pursuit: ${
    data.preliminaryExamination.motilityTest.version.pursuit
  }</td>
            </tr>
          </table>
          <table>
            <tr>
              <th colspan="2">STEREOPSIS</th>
            </tr>
            <tr>
              <td style="text-align: start; vertical-align: text-top;" colspan="2">${
                data.preliminaryExamination.stereoptyTest.stereopsis
              }</td>
            </tr>
            <tr>
              <th colspan="2">COLOR VISION (Ishihara)</th>
            </tr>
            <tr>
              <th class="text-center">OD</th>
              <th class="text-center">OS</th>
            </tr>
            <tr>
              <td class="text-center">${
                data.preliminaryExamination.colorVision.ishihara.od
              }</td>
              <td class="text-center">${
                data.preliminaryExamination.colorVision.ishihara.os
              }</td>
            </tr>
          </table>
        </section>
        <section class="mt-2">
          <table>
            <tr>
              <th class="text-center" colspan="4">NEAR POINT ACCOMMODATION</th>
            </tr>
            <tr>
              <td class="font-bold">Trial</td>
              <td class="text-center font-bold">OD</td>
              <td class="text-center font-bold">OS</td>
              <td class="text-center font-bold">OU</td>
            </tr>            
            </tr>
              <td>1st Trial</td>
              <td class="text-center">${
                data.preliminaryExamination.nearPointAccomodation.od.trial1
              }</td>
              <td class="text-center">${
                data.preliminaryExamination.nearPointAccomodation.os.trial1
              }</td>
              <td class="text-center">${
                data.preliminaryExamination.nearPointAccomodation.ou.trial1
              }</td>
            </tr>
            <tr>
              <td>2nd Trial</td>
              <td class="text-center">${
                data.preliminaryExamination.nearPointAccomodation.od.trial2
              }</td>
              <td class="text-center">${
                data.preliminaryExamination.nearPointAccomodation.os.trial2
              }</td>
              <td class="text-center">${
                data.preliminaryExamination.nearPointAccomodation.ou.trial2
              }</td>
            </tr>
            <tr>
              <td>3rd Trial</td>
              <td class="text-center">${
                data.preliminaryExamination.nearPointAccomodation.od.trial3
              }</td>
              <td class="text-center">${
                data.preliminaryExamination.nearPointAccomodation.os.trial3
              }</td>
              <td class="text-center">${
                data.preliminaryExamination.nearPointAccomodation.ou.trial3
              }</td>
            </tr>
          </table>
          <div class="flex gap-2">
          <table class="mt-2">
            <tr>
              <th colspan="2">NEAR POINT CONVERGENCE</th>
            </tr>
            <tr>
              <td>Trial</td>
              <td class="text-center font-bold">OU</td>
            </tr>
            <tr>
              <td>1st Trial</td>
              <td>${
                data.preliminaryExamination.nearPointConvergence.ou.trial1
              }</td>
            </tr>
            <tr>
              <td>2nd Trial</td>
              <td>${
                data.preliminaryExamination.nearPointConvergence.ou.trial2
              }</td>
            </tr>
            <tr>
              <td>3rd Trial</td>
              <td>${
                data.preliminaryExamination.nearPointConvergence.ou.trial3
              }</td>
            </tr>
          </table>
          <div style="width: 100%; display: flex; gap: 4rem; justify-content: center; font-size: 10pt;">
            <div class="flex gap-2" style="align-items: center; justify-content: center;">
              <input type="checkbox" name="subjective" id="subjective" ${
                data.preliminaryExamination.subjectiveOrObjective ===
                "subjective"
                  ? "checked"
                  : ""
              }>
              <label for="subjective">Subjective</label>
            </div>
            <div class="flex gap-2" style="align-items: center; justify-content: center;">
              <input type="checkbox" name="objective" id="objective" ${
                data.preliminaryExamination.subjectiveOrObjective ===
                "objective"
                  ? "checked"
                  : ""
              }>
              <label for="objective">Objective</label>
            </div>
          </div>
        </div>
        </section>
        <section class="mt-2">
          <table>
            <tr>
              <th colspan="4" class="text-center">VISUAL ACUITY</th>
            </tr>
            <tr>
              <th></th>
              <th class="text-center" style="flex: 1;">Unaided</th>
              <th class="text-center" style="flex: 1;">Aided</th>
              <th class="text-center" style="flex: 1;">Pinhole</th>
            </tr>
            <tr>
              <th>Distance</th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
            <tr>
              <td>OD</td>
              <td class="text-center">${
                data.visualAcuity.unaided.distance.od
              }</td>
              <td class="text-center">${
                data.visualAcuity.aided.distance.od
              }</td>
              <td class="text-center">${data.visualAcuity.pinhole.OD}</td>
            </tr>
            <tr>
              <td>OS</td>
              <td class="text-center">${
                data.visualAcuity.unaided.distance.os
              }</td>
              <td class="text-center">${
                data.visualAcuity.aided.distance.os
              }</td>
              <td class="text-center">${data.visualAcuity.pinhole.OS}</td>
            </tr>
            <tr>
              <td>OU</td>
              <td class="text-center">${
                data.visualAcuity.unaided.distance.ou
              }</td>
              <td class="text-center">${
                data.visualAcuity.aided.distance.ou
              }</td>
              <td class="text-center"></td>
            </tr>
            <tr>
              <th>Near</th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
            <tr>
              <td>OD</td>
              <td class="text-center">${data.visualAcuity.unaided.near.od}</td>
              <td class="text-center">${data.visualAcuity.aided.near.od}</td>
              <td class="text-center"></td>
            </tr>
            <tr>
              <td>OS</td>
              <td class="text-center">${data.visualAcuity.unaided.near.os}</td>
              <td class="text-center">${data.visualAcuity.aided.near.os}</td>
              <td class="text-center"></td>
            </tr>
            <tr>
              <td>OU</td>
              <td class="text-center">${data.visualAcuity.unaided.near.ou}</td>
              <td class="text-center">${data.visualAcuity.aided.near.ou}</td>
              <td class="text-center"></td>
            </tr>
            <tr>
              <th colspan="4">Notes</th>
            </tr>
            <tr>
              <td colspan="4">${data.visualAcuity.unaided.note}</td>
            </tr>
          </table>
        </section>
        <section class="mt-2">
          <table>
            <tr>
              <th colspan="5" class="text-center">REFRACTION</th>
            </tr>
            <tr>
              <td style="width: 25%;">OD</td>
              <td>Dsph = ${data.visualAcuity.refraction.od.dsph}</td>
              <td>Dcyl x ${data.visualAcuity.refraction.od.dcylx}</td>
              <td>VA x ${data.visualAcuity.refraction.od.va}</td>
            </tr>
            <tr>
              <td style="width: 25%;">OS</td>
              <td>Dsph = ${data.visualAcuity.refraction.os.dsph}</td>
              <td>Dcyl x ${data.visualAcuity.refraction.os.dcylx}</td>
              <td>VA x ${data.visualAcuity.refraction.os.va}</td>
            </tr>
            <tr>
              <th colspan="2">Add</th>
              <th colspan="2">Reading Range</th>
            </tr>
            <tr>
              <td colspan="2">${data.visualAcuity.refraction.add}</td>
              <td colspan="2"></td>
            </tr>
            <tr>
              <th colspan="2">Modifications</th>
              <th>Keratometry</th>
              <th>Autorefractometer</th>
            </tr>
            <tr>
              <td colspan="2">${data.visualAcuity.refraction.modifications}</td>
              <td></td>
              <td>${data.visualAcuity.refraction.autorefractometer}</td>
            </tr>
            <tr>
              <th colspan="4">FINAL RX</th>
            </tr>
            <tr>
              <td colspan="4" style="background-color:beige;text-transform: uppercase; padding-left: 1rem;">${
                data.visualAcuity.refraction.finalRx
              }</td>
            </tr>
            <tr>
              <th colspan="2">DIAGNOSIS</th>
              <th colspan="2">RECOMMENDATION</th>
            </tr>
            <tr>
              <td colspan="2"></td>
              <td colspan="2"></td>
            </tr>
            <tr>
              <td colspan="4" style="text-align: end; padding-right: 1rem;"><span style="font-weight: bold; margin-right: .5rem;">Refracted by:</span>${
                data.clinician.firstName
              } ${data.clinician.middleName} ${data.clinician.lastName}</td>
            </tr>
          </table>
        </section>
        <section class="mt-2">
          <p class="font-semibold mb-2 w-full bg-gray-200 mt-4 text-center">
            PHOROMETRY
          </p>
          <table>
            <tr>
              <th colspan="4" class="text-center">PHORIA</th>
            </tr>
            <tr>
              <th class="text-center" colspan="2" style="width: 50%;">Distance</th>
              <th class="text-center" colspan="2">Near</th>
            </tr>
            <tr>
              <td colspan="2">HORIZONTAL (VT# 3): <span class="font-bold">${
                data.phorometry.phoria.distance.horizontalvt3
              }</span></td>
              <td colspan="2">HORIZONTAL (VT# 13A): <span class="font-bold">${
                data.phorometry.phoria.near.horizontalvt13a
              }</span></td>
            </tr>
            <tr>
              <td colspan="2">HORIZONTAL (VT# 8): <span class="font-bold">${
                data.phorometry.phoria.distance.vt8
              }</span></td>
              <td colspan="2">HORIZONTAL (VT# 13B): <span class="font-bold">${
                data.phorometry.phoria.near.vt13b
              }</span></td>
            </tr>
            <tr>
              <td colspan="2">VERTICAL (VT# 12): <span class="font-bold">${
                data.phorometry.phoria.distance.verticalvt12
              }</span></td>
              <td colspan="2">VERTICAL (VT# 18): <span class="font-bold">${
                data.phorometry.phoria.near.verticalvt18
              }</span></td>
            </tr>
            <tr>
              <th colspan="4" class="text-center">DUCTION</th>
            </tr>
            <tr>
              <th class="text-center" colspan="2" style="width: 50%;">Distance</th>
              <th class="text-center" colspan="2">Near</th>
            </tr>
            <tr>
              <td colspan="2"><sup>s</sup>BD: <span class="font-bold">OD ${
                data.phorometry.duction.distance.sbdod
              }&nbsp;&nbsp;OS ${
    data.phorometry.duction.distance.sbdos
  }</span></td>
              <td colspan="2"><sup>s</sup>BU: <span class="font-bold">OD ${
                data.phorometry.duction.near.sbdod
              }&nbsp;&nbsp;OS ${data.phorometry.duction.near.sbdos}</span></td>
            </tr>
            <tr>
              <td colspan="2"><sup>I</sup>BD: <span class="font-bold">OD ${
                data.phorometry.duction.distance.lbuod
              }&nbsp;&nbsp;OS ${
    data.phorometry.duction.distance.lbuos
  }</span></td>
              <td colspan="2"><sup>I</sup>BU: <span class="font-bold">OD ${
                data.phorometry.duction.near.lbuod
              }&nbsp;&nbsp;OS ${data.phorometry.duction.near.lbuos}</span></td>
            </tr>
            <tr>
              <th colspan="4" class="text-center">VERGENCE</th>
            </tr>
            <tr>
              <th class="text-center" colspan="2" style="width: 50%;">Distance</th>
              <th class="text-center" colspan="2">Near</th>
            </tr>
            <tr>
              <td colspan="2">BO (VT# 9): <span class="font-bold">${
                data.phorometry.vergence.distance.bovt9
              }</span></td>
              <td colspan="2">BO (VT# 16A): <span class="font-bold">${
                data.phorometry.vergence.near.bovt16a
              }</span></td>
            </tr>
            <tr>
              <td colspan="2">BO (VT# 10): <span class="font-bold">${
                data.phorometry.vergence.distance.vt10
              }</span></td>
              <td colspan="2">BO (VT# 16B): <span class="font-bold">${
                data.phorometry.vergence.near.vt16b
              }</span></td>
            </tr>
            <tr>
              <td colspan="2">BI (VT# 11): <span class="font-bold">${
                data.phorometry.vergence.distance.bivt11
              }</span></td>
              <td colspan="2">BI (VT# 17A): <span class="font-bold">${
                data.phorometry.vergence.near.bivt17a
              }</span></td>
            </tr>
            <tr>
              <td></td>
              <td colspan="2">BI (VT# 17B): <span class="font-bold">${
                data.phorometry.vergence.near.vt17b
              }</span></td>
            </tr>
            <tr>
              <th colspan="4" class="text-center">CROSS-CYLINDER</th>
            </tr>
            <tr>
              <th class="text-center" colspan="2" style="width: 50%;">Distance</th>
              <th class="text-center" colspan="2">Near</th>
            </tr>
            <tr>
              <td colspan="2">Dissociated: <span class="font-bold">OD ${
                data.phorometry.crossCylinder.distance.dissociatedOD
              }</span></td>
              <td colspan="2">Binocular: <span class="font-bold">OS ${
                data.phorometry.crossCylinder.near.binocularOD
              }</span></td>
            </tr>
            <tr>
              <td colspan="2">Phoria: <span class="font-bold">OD ${
                data.phorometry.crossCylinder.distance.phoriaOD
              }</span></td>
              <td colspan="2">Phoria: <span class="font-bold">OS ${
                data.phorometry.crossCylinder.near.phoriaOS
              }</span></td>
            </tr>
            <tr>
              <th class="text-center" colspan="4">ACCOMMODATIVE TEST</th>
            </tr>
            <tr>
              <th class="text-center" style="width: 25%;">AOA</th>
              <th class="text-center">PRA</th>
              <th class="text-center">NRA</th>
              <th class="text-center">Gradient AC/A Ratio</th>
            </tr>
            <tr>
              <td rowspan="1">OD: ${
                data.phorometry.accomodativeTest.aoa.od
              }</td>
              <td class="text-center" rowspan="3" style="text-align: center; vertical-align: text-top;">${
                data.phorometry.accomodativeTest.pra
              }</td>
              <td class="text-center" rowspan="3" style="text-align: center; vertical-align: text-top;">${
                data.phorometry.accomodativeTest.nra
              }</td>
              <td class="text-center" rowspan="3" style="text-align: center; vertical-align: text-top;">${
                data.phorometry.accomodativeTest.gradientAcaRatio
              }</td>
            </tr>
            <tr>
              <td>OS: ${data.phorometry.accomodativeTest.aoa.os}</td>
            </tr>
            <tr>
              <td>OU: ${data.phorometry.accomodativeTest.aoa.ou}</td>
            </tr>
            <tr>
              <th colspan="4">Calculated AC/A Ratio</th>
            </tr>
            <tr>
              <td colspan="4">${
                data.phorometry.accomodativeTest.calculatedAcaRatio
              }</td>
            </tr>
            <tr>
              <th colspan="4">Hoffsteters Formula</th>
            </tr>
            <tr>
              <td colspan="4">${
                data.phorometry.accomodativeTest.hoffstetersFormula
              }</td>
            </tr>
          </table>
        </section>
        <section class="mt-2">
          <table class="mt-2">
            <tr>
              <th style="width: 50%;">EXTERNAL EYE EXAMINATION</th>
              <th class="text-center">OD</th>
              <th class="text-center">OS</th>
            </tr>
            <tr>
              <td>Eyelids</td>
              <td class="text-center">${
                data.externalEyeExamination.eyelid.od
              }</td>
              <td class="text-center">${
                data.externalEyeExamination.eyelid.os
              }</td>
            </tr>
            <tr>
              <td >Eyelashes</td>
              <td class="text-center">${
                data.externalEyeExamination.eyelashes.od
              }</td>
              <td class="text-center">${
                data.externalEyeExamination.eyelashes.os
              }</td>
            </tr>
            <tr>
              <td >Eyebrows</td>
              <td class="text-center">${
                data.externalEyeExamination.eyebrows.od
              }</td>
              <td class="text-center">${
                data.externalEyeExamination.eyebrows.os
              }</td>
            </tr>
            <tr>
              <td >Cornea</td>
              <td class="text-center">${
                data.externalEyeExamination.cornea.od
              }</td>
              <td class="text-center">${
                data.externalEyeExamination.cornea.os
              }</td>
            </tr>
              <td>Sclera</td>
              <td class="text-center">${
                data.externalEyeExamination.sclera.od
              }</td>
              <td class="text-center">${
                data.externalEyeExamination.sclera.os
              }</td>
            </tr>
              <tr>
              <td>Iris</td>
              <td class="text-center">${
                data.externalEyeExamination.iris.od
              }</td>
              <td class="text-center">${
                data.externalEyeExamination.iris.os
              }</td>
              </tr>
              <tr>
              <td>Pupil</td>
              <td class="text-center">${
                data.externalEyeExamination.pupil.od
              }</td>
              <td class="text-center">${
                data.externalEyeExamination.pupil.os
              }</td>
              </tr>
              <tr>
              <td>Lens Media</td>
              <td class="text-center">${
                data.externalEyeExamination.lensmedia.od
              }</td>
              <td class="text-center">${
                data.externalEyeExamination.lensmedia.os
              }</td>
              </tr>
              <tr>
              <td>Conjunctiva</td>
              <td class="text-center">${
                data.externalEyeExamination.conjunctiva.od
              }</td>
              <td class="text-center">${
                data.externalEyeExamination.conjunctiva.os
              }</td>
              </tr>
              <tr>
              <td>Bulbar Conjunctiva</td>
              <td class="text-center">${
                data.externalEyeExamination.bulbarConjunctiva.od
              }</td>
              <td class="text-center">${
                data.externalEyeExamination.bulbarConjunctiva.os
              }</td>
              </tr>
              <tr>
              <td>Palpebral</td>
              <td class="text-center">${
                data.externalEyeExamination.palpebral.od
              }</td>
              <td class="text-center">${
                data.externalEyeExamination.palpebral.os
              }</td>
              </tr>
              <tr>
              <td>Palpebral Fissure</td>
              <td class="text-center">${
                data.externalEyeExamination.palpebralFissure.od
              }</td>
              <td class="text-center">${
                data.externalEyeExamination.palpebralFissure.os
              }</td>
              </tr>
              <tr>
              <td>Anterior Chamber</td>
              <td class="text-center">${
                data.externalEyeExamination.anteriorChamber.od
              }</td>
              <td class="text-center">${
                data.externalEyeExamination.anteriorChamber.os
              }</td>
              </tr>
              <tr>
              <td colspan="3"><span class="font-bold">Instruments Used:</span> ${
                data.externalEyeExamination.instrumentsUsed
              }</td>
              </tr>
              <tr>
              <td colspan="3"><span class="font-bold">Other Observation:</span> ${
                data.externalEyeExamination.otherObservation
              }</td>
              </tr>
          </table>
          <table class="mt-2">
            <tr>
              <th style="width: 50%;">OPHTHALMOSCOPY</th>
              <th class="text-center">OD</th>
              <th class="text-center">OS</th>
            </tr>
            <tr>
              <td>ROR</td>
              <td class="text-center">${data.ophthalmoscopy.ror.od}</td>
              <td class="text-center">${data.ophthalmoscopy.ror.os}</td>
            </tr>
            <tr>
              <td>C/D Ratio</td>
              <td class="text-center">${data.ophthalmoscopy.cdratio.od}</td>
              <td class="text-center">${data.ophthalmoscopy.cdratio.os}</td>
            </tr>
            <tr>
              <td>Venous Pulsation</td>
              <td class="text-center">${
                data.ophthalmoscopy.venousPulsation.od
              }</td>
              <td class="text-center">${
                data.ophthalmoscopy.venousPulsation.os
              }</td>
            </tr>
            <tr>
              <td>A/V Ratio</td>
              <td class="text-center">${data.ophthalmoscopy.avratio.od}</td>
              <td class="text-center">${data.ophthalmoscopy.avratio.os}</td>
            </tr>
            <tr>
              <td>A/V Crossing</td>
              <td class="text-center">${data.ophthalmoscopy.avcrossing.od}</td>
              <td class="text-center">${data.ophthalmoscopy.avcrossing.os}</td>
            </tr>
            <tr>
              <td>Macula</td>
              <td class="text-center">${data.ophthalmoscopy.macula.od}</td>
              <td class="text-center">${data.ophthalmoscopy.macula.os}</td>
            </tr>
            <tr>
              <td>Foveal Reflex</td>
              <td class="text-center">${
                data.ophthalmoscopy.fovealReflex.od
              }</td>
              <td class="text-center">${
                data.ophthalmoscopy.fovealReflex.os
              }</td>
            </tr>
            <tr>
              <td>Periphery</td>
              <td class="text-center">${data.ophthalmoscopy.periphery.od}</td>
              <td class="text-center">${data.ophthalmoscopy.periphery.os}</td>
            </tr>
            <tr>
              <td>Other Observation</td>
              <td class="text-center">${
                data.ophthalmoscopy.otherObservation
              }</td>
              <td class="text-center"></td>
            </tr>
            <tr>
              <td colspan="3"><span class="font-bold">Instruments Used:</span> ${
                data.ophthalmoscopy.instrumentsUsed
              }</td>
            </tr>
            <tr>
              <td colspan="3"><span class="font-bold">Other Observation:</span> ${
                data.ophthalmoscopy.otherObservation
              }</td>
            </tr>
          </table>
          <table>
            <tr>
              <th>BRUCKNER TEST</th>
            </tr>
            <tr>
              <td><span class="font-bold">OD: </span>${
                data.ophthalmoscopy.ror.od
              }</td>
            </tr>
            <tr>
              <td><span class="font-bold">OS: </span>${
                data.ophthalmoscopy.ror.os
              }</td>
            </tr>
            <tr>
              <td><span class="font-bold">Notes: </span>${
                data.ophthalmoscopy.otherObservation
              }</td>
            </tr>
          </table>
        </section>
        </section>
      </main>
    </body>
  </html>
  `;
};

export default EyeExamReport;
