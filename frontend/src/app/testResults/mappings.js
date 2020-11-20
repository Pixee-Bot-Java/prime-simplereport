import {
  birthDate,
  firstName,
  middleName,
  lastName,
  address,
  telephone,
  city,
  state,
  zip,
  receivedAt,
  testResult,
  patientId,
  testResultId,
  createMappingInterface,
} from "../utils/mappers";

export const testResultMapping = createMappingInterface([
  birthDate,
  firstName,
  middleName,
  lastName,
  address,
  telephone,
  city,
  state,
  zip,
  patientId,
  receivedAt,
  testResult,
  patientId,
  testResultId,
]);
