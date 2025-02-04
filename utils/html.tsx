export const html = `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eye Examination Report</title>
    <style>
        @page {
            size: A4;
            margin: 0;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 8pt;
            line-height: 1.2;
            margin: 0;
            padding: 10mm;
            box-sizing: border-box;
        }
        h1 {
            font-size: 14pt;
            margin-bottom: 10px;
        }
        h2 {
            font-size: 11pt;
            margin-top: 10px;
            margin-bottom: 5px;
        }
        .page {
            page-break-after: always;
            height: 277mm;
            margin-top: 10mm;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo {
            width: 60px;
            height: auto;
        }
        .clinic-info {
            text-align: center;
        }
        .clinic-name {
            font-size: 16pt;
            font-weight: bold;
        }
        .clinic-subname {
            font-size: 12pt;
        }
        .section {
            margin-bottom: 10px;
        }
        .bold {
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 7pt;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 2px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <img src="https://national-u.edu.ph/wp-content/uploads/2018/12/cropped-NU-Shield_FC_RGB_POS_AW.png" alt="National University Logo" class="logo">
            <div class="clinic-info">
                <div class="clinic-name">National University</div>
                <div class="clinic-subname">School of Optometry</div>
            </div>
            <div>Date: February 1, 2025</div>
        </div>

        <h1>Eye Examination Report</h1>

        <div class="section">
            <h2>Patient and Clinician Information</h2>
            <table>
                <tr>
                    <th colspan="2">Patient Information</th>
                    <th colspan="2">Clinician Information</th>
                </tr>
                <tr>
                    <td class="bold">Name:</td>
                    <td>John Mike Cuestas Alvizo</td>
                    <td class="bold">Name:</td>
                    <td>Camila Mora Ragos</td>
                </tr>
                <tr>
                    <td class="bold">Age:</td>
                    <td>23</td>
                    <td class="bold">Role:</td>
                    <td>Student-clinician</td>
                </tr>
                <tr>
                    <td class="bold">Gender:</td>
                    <td>Male</td>
                    <td class="bold">ID:</td>
                    <td>2022-152313</td>
                </tr>
                <tr>
                    <td class="bold">Occupation:</td>
                    <td>Frontend Developer</td>
                    <td colspan="2"></td>
                </tr>
                <tr>
                    <td class="bold">Contact:</td>
                    <td>09623175170</td>
                    <td colspan="2"></td>
                </tr>
                <tr>
                    <td class="bold">Email:</td>
                    <td>mikealvizo44@gmail.com</td>
                    <td colspan="2"></td>
                </tr>
            </table>
        </div>

        <div class="section">
            <h2>Eye Triage</h2>
            <table>
                <tr>
                    <th>Symptom</th>
                    <th>Status</th>
                </tr>
                <tr>
                    <td>Experiencing Symptoms</td>
                    <td>Yes</td>
                </tr>
                <tr>
                    <td>Pain/Itching/Discomfort</td>
                    <td>Yes</td>
                </tr>
                <tr>
                    <td>Flashes or Floaters</td>
                    <td>No</td>
                </tr>
                <tr>
                    <td>Recent Illnesses</td>
                    <td>No</td>
                </tr>
                <tr>
                    <td>Exposed to Chemical Irritants/Allergens</td>
                    <td>No</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <h2>Patient Case Record</h2>
            <table>
                <tr>
                    <th>Category</th>
                    <th>Details</th>
                </tr>
                <tr>
                    <td>Visual Complaints</td>
                    <td>ueheiejsjw, nds, jsbs</td>
                </tr>
                <tr>
                    <td>Non-Visual Complaints</td>
                    <td>hsbsisnuwbwja, hsbsba</td>
                </tr>
                <tr>
                    <td>Family History</td>
                    <td>Cataract, Glaucoma, Astigmatism</td>
                </tr>
                <tr>
                    <td>Social History</td>
                    <td>Smoke (Duration: 10 days)</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <h2>Preliminary Examination</h2>
            <table>
                <tr>
                    <th>Test</th>
                    <th>Result</th>
                </tr>
                <tr>
                    <td>Pupillary Distance (OD/OS)</td>
                    <td>mod / mos</td>
                </tr>
                <tr>
                    <td>Pupillary Distance (Near/Far)</td>
                    <td>bod / bof</td>
                </tr>
                <tr>
                    <td>Ocular Dominance</td>
                    <td>Dominant Eye: OD, Dominant Hand: Right</td>
                </tr>
                <tr>
                    <td>Note</td>
                    <td>Crossed dominance</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <h2>External Eye Examination</h2>
            <table>
                <tr>
                    <th>Structure</th>
                    <th>OD (Right Eye)</th>
                    <th>OS (Left Eye)</th>
                </tr>
                <tr>
                    <td>Eyelid</td>
                    <td>eyelidsod</td>
                    <td>eyelids</td>
                </tr>
                <tr>
                    <td>Eyelashes</td>
                    <td>ksbx</td>
                    <td>jsbxjs</td>
                </tr>
                <tr>
                    <td>Eyebrows</td>
                    <td>jsbsjskw</td>
                    <td>jsbsjsjw</td>
                </tr>
                <tr>
                    <td>Cornea</td>
                    <td>jshsjs</td>
                    <td>jsbdie</td>
                </tr>
                <tr>
                    <td>Sclera</td>
                    <td>jsbdiw</td>
                    <td>oaoqpq</td>
                </tr>
                <tr>
                    <td>Iris</td>
                    <td>isjxixix</td>
                    <td>p2pwps</td>
                </tr>
                <tr>
                    <td>Pupil</td>
                    <td>snsiwow</td>
                    <td>dbxiwow</td>
                </tr>
                <tr>
                    <td>Lens Media</td>
                    <td>shxiwow</td>
                    <td>idbdiw</td>
                </tr>
                <tr>
                    <td>Conjunctiva</td>
                    <td>idhsisjwow</td>
                    <td>idjdowowo</td>
                </tr>
                <tr>
                    <td>Bulbar Conjunctiva</td>
                    <td>isjsosos</td>
                    <td>isjsowoow</td>
                </tr>
                <tr>
                    <td>Palpebral</td>
                    <td>ksjdosos</td>
                    <td>kdjdosow</td>
                </tr>
                <tr>
                    <td>Palpebral Fissure</td>
                    <td>odjwososn</td>
                    <td>osndowjw</td>
                </tr>
                <tr>
                    <td>Anterior Chamber</td>
                    <td>1</td>
                    <td>3</td>
                </tr>
            </table>
            <p><span class="bold">Instruments Used:</span> none</p>
            <p><span class="bold">Other Observation:</span> none</p>
        </div>
    </div>

    <div class="page">
        <div class="section">
            <h2>Ophthalmoscopy</h2>
            <table>
                <tr>
                    <th>Feature</th>
                    <th>OD (Right Eye)</th>
                    <th>OS (Left Eye)</th>
                </tr>
                <tr>
                    <td>AV Crossing</td>
                    <td>avcod</td>
                    <td>avcos</td>
                </tr>
                <tr>
                    <td>AV Ratio</td>
                    <td>avod</td>
                    <td>avos</td>
                </tr>
                <tr>
                    <td>CD Ratio</td>
                    <td>cdod</td>
                    <td>cdos</td>
                </tr>
                <tr>
                    <td>Foveal Reflex</td>
                    <td>frod</td>
                    <td>frod</td>
                </tr>
                <tr>
                    <td>Macula</td>
                    <td>mod</td>
                    <td>mos</td>
                </tr>
                <tr>
                    <td>Periphery</td>
                    <td>pod</td>
                    <td>pos</td>
                </tr>
                <tr>
                    <td>ROR</td>
                    <td>rorod</td>
                    <td>roros</td>
                </tr>
                <tr>
                    <td>Venous Pulsation</td>
                    <td>vpod</td>
                    <td>vpos</td>
                </tr>
            </table>
            <p><span class="bold">Instruments Used:</span> vlDkanz</p>
            <p><span class="bold">Other Observations:</span> ibvjsjsb</p>
        </div>

        <div class="section">
            <h2>Visual Acuity</h2>
            <table>
                <tr>
                    <th>Measurement</th>
                    <th>OD (Right Eye)</th>
                    <th>OS (Left Eye)</th>
                    <th>OU (Both Eyes)</th>
                </tr>
                <tr>
                    <td>Unaided Distance</td>
                    <td>jsbsus</td>
                    <td>jsjsjs</td>
                    <td>jsjdusjs</td>
                </tr>
                <tr>
                    <td>Unaided Near</td>
                    <td>isndis</td>
                    <td>isjdjs</td>
                    <td>isnsjd</td>
                </tr>
                <tr>
                    <td>Aided Distance</td>
                    <td>jendke</td>
                    <td>isnsie</td>
                    <td>iebdie</td>
                </tr>
                <tr>
                    <td>Aided Near</td>
                    <td>jendie</td>
                    <td>iensie</td>
                    <td>iebdie</td>
                </tr>
            </table>
            <p><span class="bold">Unaided Note:</span> jsbsus</p>
            <p><span class="bold">Aided Note:</span> jsbsjs</p>
        </div>

        <div class="section">
            <h2>Phorometry</h2>
            <table>
                <tr>
                    <th>Test</th>
                    <th>Distance</th>
                    <th>Near</th>
                </tr>
                <tr>
                    <td>Phoria Horizontal</td>
                    <td>VT3: jebdie</td>
                    <td>VT13a: jdbdiw</td>
                </tr>
                <tr>
                    <td>Phoria Vertical</td>
                    <td>VT12: jsbdjs</td>
                    <td>VT18: jsbsjs</td>
                </tr>
            </table>
            <table>
                <tr>
                    <th>Duction</th>
                    <th>OD Distance</th>
                    <th>OS Distance</th>
                    <th>OD Near</th>
                    <th>OS Near</th>
                </tr>
                <tr>
                    <td>SBD</td>
                    <td>97/9</td>
                    <td>65/46</td>
                    <td>61/94</td>
                    <td>19/46</td>
                </tr>
                <tr>
                    <td>LBU</td>
                    <td>94/94</td>
                    <td>61/91</td>
                    <td>61/94</td>
                    <td>64/91</td>
                </tr>
            </table>
            <table>
                <tr>
                    <th>Vergence</th>
                    <th>Distance</th>
                    <th>Near</th>
                </tr>
                <tr>
                    <td>BO</td>
                    <td>VT9: 61/91</td>
                    <td>VT16a: 61/94</td>
                </tr>
                <tr>
                    <td>BI</td>
                    <td>VT11: 61/91</td>
                    <td>VT17a: 91/91</td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>
`