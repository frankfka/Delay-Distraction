import { ENABLED_KEY } from '../common.js';
import { getExtensionData, setExtensionData } from '../common.js';

const CONFIGURE_BTN_ID = "configure-btn";
const ENABLE_BTN_ID = "enable-btn";

let isDelayEnabled = false;

function updateButtonState(enabled) {
  let enableButton = document.getElementById("enable-btn");
  if (!enableButton) {
    return;
  }
  enableButton.innerText = enabled ? "Enabled" : "Disabled";
  enableButton.style.backgroundColor = enabled ? "mediumspringgreen" : "red";
  enableButton.style.color = enabled ? "black" : "white";
}


async function main() {
  getExtensionData(ENABLED_KEY).then(isEnabled => {
    isDelayEnabled = isEnabled;
    // Update button state to match current enable status
    updateButtonState(isDelayEnabled);
    // Add event listener for enable/disable and config
    document.addEventListener("click", (e) => {
      e.preventDefault();
      switch (e.target.id) {
        case ENABLE_BTN_ID: {
          let newState = !isDelayEnabled;
          // Update button after saving to storage
          setExtensionData(ENABLED_KEY, newState).then(() => {
            isDelayEnabled = newState;
            updateButtonState(isDelayEnabled)
          });
          break;
        }
        case CONFIGURE_BTN_ID: {
          browser.tabs.create({
            url: "../configure_tab/configure_tab.html"
          });
          break;
        }
      }
    })
  })
}

main();
