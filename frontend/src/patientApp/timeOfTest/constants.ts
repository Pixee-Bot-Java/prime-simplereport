// BEGIN things that should be service calls
export const pregnancyMap = {
  "77386006": "Yes",
  "60001007": "No",
  "261665006": "Prefer not to answer",
} as const;

export type Pregnancy = typeof pregnancyMap;
export type PregnancyCode = keyof Pregnancy;
export type PregnancyDescription = Pregnancy[PregnancyCode];

type PregnancyResponses = {
  label: PregnancyDescription;
  value: PregnancyCode;
}[];

const pregnancyOrder: PregnancyCode[] = ["77386006", "60001007", "261665006"];

export const getPregnancyResponses = (): PregnancyResponses =>
  pregnancyOrder.map((value) => ({ value, label: pregnancyMap[value] }));

export const respiratorySymptomsMap = {
  "426000000": "Fever over 100.4F",
  "103001002": "Feeling feverish",
  "43724002": "Chills",
  "49727002": "Cough",
  "267036007": "Shortness of breath",
  "230145002": "Difficulty breathing",
  "84229001": "Fatigue",
  "68962001": "Muscle or body aches",
  "25064002": "Headache",
  "36955009": "New loss of taste",
  "44169009": "New loss of smell",
  "162397003": "Sore throat",
  "68235000": "Nasal congestion",
  "64531003": "Runny nose",
  "422587007": "Nausea",
  "422400008": "Vomiting",
  "62315008": "Diarrhea",
} as const;

export type RespiratorySymptoms = typeof respiratorySymptomsMap;
export type RespiratorySymptomCode = keyof RespiratorySymptoms;
export type RespiratorySymptomName =
  RespiratorySymptoms[RespiratorySymptomCode];

export const respiratorySymptomOrder: RespiratorySymptomCode[] =
  alphabetizeSymptomKeysFromMapValues(respiratorySymptomsMap);

export const respiratorySymptomDefinitions: SymptomDefinitionMap[] =
  respiratorySymptomOrder.map((value) => ({
    value,
    label: respiratorySymptomsMap[value],
  }));

export type SymptomDefinitionMap = {
  value: string;
  label: string;
};
export const syphillisHistoryMap = {
  // Snomed for "history of syphilis"
  "1087151000119108": "Yes",
  // This is the general snomed for "No history of" since I couldn't find one
  // specific to Syphilis
  "14732006": "No",
  // general unknown code, taken from pregnancy
  "261665006": "Prefer not to answer",
} as const;

export type SyphilisHistory = typeof syphillisHistoryMap;
export type SyphilisHistoryCode = keyof SyphilisHistory;
export type SyphilisHistoryDescription = SyphilisHistory[SyphilisHistoryCode];

type SyphilisHistoryResponses = {
  label: SyphilisHistoryDescription;
  value: SyphilisHistoryCode;
}[];

const syphilisOrder: SyphilisHistoryCode[] = [
  "1087151000119108",
  "14732006",
  "261665006",
];

export const getSyphilisHistoryValues = (): SyphilisHistoryResponses =>
  syphilisOrder.map((value) => ({ value, label: syphillisHistoryMap[value] }));

export const syphilisSymptomsMap = {
  "724386005": "Genital sore/lesion",
  // Anal skin tag (195469007); Anal tag (195469007); Fibrous polyp of anus (195469007)
  "195469007": "Anal sore/lesion",
  // 	Ulcer of mouth (26284000); Oral ulcer (26284000); Mouth ulceration (26284000); Ulceration of oral mucosa (26284000); Mouth ulcer (26284000)
  "26284000": "Sore(s) in mouth/lips",
  "266128007": "Body Rash",
  "56940005": "Palmar (hand)/plantar (foot) rash",
  "91554004": "Flat white warts",
  "15188001": "Hearing loss",
  "46636008": "Blurred vision",
  "68225006": "Patchy hair loss",
} as const;

export type SyphilisSymptoms = typeof syphilisSymptomsMap;
export type SyphilisSymptomCode = keyof SyphilisSymptoms;

const syphilisSymptomOrder: SyphilisSymptomCode[] =
  alphabetizeSymptomKeysFromMapValues(syphilisSymptomsMap);

export function alphabetizeSymptomKeysFromMapValues(dict: {
  [key: string]: string;
}) {
  const values = Object.values(dict);
  values.sort((a, b) => a.localeCompare(b));
  const reversedMap = Object.fromEntries(
    Object.entries(dict).map((a) => a.reverse())
  );

  return values.map((val) => {
    return reversedMap[val];
  });
}

export const syphilisSymptomDefinitions: SymptomDefinitionMap[] =
  syphilisSymptomOrder.map((value) => ({
    value,
    label: syphilisSymptomsMap[value],
  }));
