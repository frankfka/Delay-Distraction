import { ENTRIES_KEY, ENTRY_KEY, DELAY_KEY,
  getExtensionData, setExtensionData } from '../common.js';

// HTML to insert as a row when saved
const NEW_ROW = '<tr>' +
  // Entry Value
  '<td class="entry">{ENTRY}</td>' +
  '<td>' +
  '<div class="row">' +
  // Delay value
  '<div class="col delay">{DELAY}</div>' +
  // Delete Button
  '<button class="btn btn-outline-danger btn-small delete">Delete</button>' +
  '</div>' +
  '</td>' +
  '</tr>';


// Initialize table with data from local storage and return the retrieved data result
async function init() {
  let storageItems = await getExtensionData(ENTRIES_KEY);
  if (storageItems) {
    storageItems.forEach((item) => {
      addRowToTable(item)
    });
    return storageItems;
  }
  return [];
}

// Adds a row with the given data, which should have ENTRY_KEY and DELAY_KEY with values
function addRowToTable(data) {
  let rowWithData = NEW_ROW.replace('{ENTRY}', data[ENTRY_KEY] ?? "")
  .replace('{DELAY}', data[DELAY_KEY] ?? "");
  $("table").find('tr:last').before(rowWithData);
}

// Get index of entry object from clicked row, or -1 if none found
function getEntriesIndex(row, entries) {
  let entry = row.find('.entry').text();
  let delay = Number(row.find('.delay').text());
  return entries.findIndex((ele) => {
    return ele[ENTRY_KEY] === entry && ele[DELAY_KEY] === delay
  });
}

// Validates the editable row, and returns a data entry if validated
function validateAndGetItemData(entryInput, delayInput) {
  // Validate the entry itself
  let entryValid = false;
  let entry = "";
  // Try to parse the value
  if (entryInput.val()) {
    entryValid = true;
    entry = entryInput.val();
  }
  // Change input validation
  changeValidation(entryInput, entryValid);

  // Validate the delay
  let delayValid = false;
  let delay = 0;
  if (delayInput.val()) {
    // Something entered, but need to validate the number itself
    let delayNum = Number(delayInput.val());
    if (Number.isFinite(delayNum) && delayNum > 0) {
      delay = delayNum;
      delayValid = true;
    }
  }
  changeValidation(delayInput, delayValid);

  if (entryValid && delayValid) {
    let data = {};
    data[ENTRY_KEY] = entry;
    data[DELAY_KEY] = delay;
    return data
  }
  return null
}

// Add/remove validation classes on the form to reflect status
function changeValidation(input, isValid) {
  if (isValid) {
    input.addClass("is-valid");
    input.removeClass("is-invalid");
  } else {
    input.addClass("is-invalid");
    input.removeClass("is-valid");
  }
}

// Clear input and validation
function clearInput(input) {
  input.val("");
  input.removeClass("is-valid");
  input.removeClass("is-invalid");
}

// Executable on document ready
$(document).ready(async function () {
  let entriesData = await init();
  // Set listener for adding new items
  $(document).on("click", ".add", function () {
    let entryInput = $('#new-entry-val');
    let delayInput = $('#new-entry-delay');
    let newData = validateAndGetItemData(entryInput, delayInput);
    if (newData) {
      // Save to local storage
      entriesData.push(newData);
      setExtensionData(ENTRIES_KEY, entriesData).then(() => {
        addRowToTable(newData);
        // Clear the current entries after creating
        clearInput(entryInput);
        clearInput(delayInput);
      }).catch((err) => {
        console.error(err);
      });
    }
  });
  // Set listener for delete buttons
  $(document).on("click", ".delete", function() {
    // Get the data entry from the row
    let clickedRow = $(this).parents("tr");
    let indexToDelete = getEntriesIndex(clickedRow, entriesData);
    if (indexToDelete > -1) {
      entriesData.splice(indexToDelete, 1);
      setExtensionData(ENTRIES_KEY, entriesData).then(() => {
        clickedRow.remove();
      }).catch((err) => {
        console.error(err);
      });
    }
  });
});