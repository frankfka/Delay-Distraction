const ENABLED_KEY = "enabled";
const ENTRIES_KEY = "entries";
const ENTRY_KEY = "entry";
const DELAY_KEY = "time";

// Main Function to run on content_script import
function main() {
  let currentUrl = window.location.href;
  getWaitTime(currentUrl).then(waitTime => {
    if (waitTime) {
      console.log(`Delaying by ${waitTime} seconds`);
      hidePage(waitTime);
    }
  });
}

// This should be synced with the method in common.js
async function getExtensionData(dataKey) {
  let retrieved = await browser.storage.local.get(dataKey);
  return retrieved[dataKey];
}

async function getWaitTime(url) {
  // Get from local storage
  let delayTimes = await getExtensionData(ENTRIES_KEY);
  let isEnabled = await getExtensionData(ENABLED_KEY);
  if (delayTimes && isEnabled) {
    let entry = delayTimes.find(item => url.toLowerCase().includes(item[ENTRY_KEY].toLowerCase()));
    if (entry) {
      return entry[DELAY_KEY];
    }
  }
  return 0;
}

function hidePage(delayInSeconds) {
  let delayMillis = delayInSeconds * 1000;
  document.documentElement.style.visibility = 'hidden';
  setTimeout(function () {
    document.documentElement.style.visibility = 'visible';
  }, delayMillis);
}

main();