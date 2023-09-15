type SupportedDisease = {
  supportedDisease: {
    name: string;
    __typename: "SupportedDisease";
  };
};
export type DeviceWithoutModelOrManufacturer = Omit<
  FacilityFormDeviceType,
  "model" | "manufacturer"
>;
type DeviceType = DeviceWithoutModelOrManufacturer | FacilityFormDeviceType;

function filterRsvFromSingleDevice(device: DeviceType) {
  const supportedDiseaseArray =
    device.supportedDiseaseTestPerformed as SupportedDisease[];

  // no supportedDiseaseTestPerformed defined due to any casting, return empty array
  if (supportedDiseaseArray === undefined) return [];

  const supportedDiseases = supportedDiseaseArray.map(
    (sd) => sd.supportedDisease.name
  );
  if (supportedDiseases.includes("RSV")) {
    return supportedDiseaseArray.filter(
      (d) => d.supportedDisease.name !== "RSV"
    );
  }
  return supportedDiseaseArray;
}

export function filterRsvFromAllDevices<AmbiguousDeviceType extends DeviceType>(
  deviceTypes: AmbiguousDeviceType[]
) {
  let filteredDevices = deviceTypes.map((d) => {
    d.supportedDiseaseTestPerformed = filterRsvFromSingleDevice(d);
    return d;
  });
  filteredDevices = filteredDevices.filter(
    (d) => d.supportedDiseaseTestPerformed.length > 0
  );
  return filteredDevices;
}
