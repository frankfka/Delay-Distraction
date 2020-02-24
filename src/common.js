export const ENABLED_KEY = "enabled";
export const ENTRIES_KEY = "entries";
export const ENTRY_KEY = "entry";
export const DELAY_KEY = "time";

export async function getExtensionData(dataKey) {
  let retrieved = await browser.storage.local.get(dataKey);
  return retrieved[dataKey];
}

export function setExtensionData(dataKey, data) {
  let newData = {};
  newData[dataKey] = data;
  return browser.storage.local.set(newData)
}
