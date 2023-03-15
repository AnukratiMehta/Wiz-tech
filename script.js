// Load the data from the JSON file
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // Get the column names and data from the JSON object
    let columnNames = data.columnNames;
    const rows = data.data;

    // Define a mapping of column names to property names in the data object
    const columnMapping = {
      "Timestamp": "event_timestamp",
      "Substation": "substation",
      "Voltage level": "voltage_level",
      "Bay": "bay",
      "Device Name": "device_name",
      "Description": "description",
      "Value": "value",
      "Quality": "quality",
      "Tag": "tag"
    };

    // Identify columns with all null values and remove them
    const nullColumns = [];
    for (let columnName of columnNames) {
      const propertyName = columnMapping[columnName];
      const hasValues = rows.some(row => row.hasOwnProperty(propertyName) && row[propertyName] !== null);
      if (!hasValues) {
        nullColumns.push(columnName);
        delete columnMapping[columnName];
      }
    }
    columnNames = columnNames.filter(name => !nullColumns.includes(name));

    // Add Acknowledge column
    columnNames.push('Acknowledge');

    // Create a new HTML table element
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped', 'table-bordered');

    // Create the table header row
    const headerRow = document.createElement('tr');
    for (let columnName of columnNames) {
      const headerCell = document.createElement('th');
      headerCell.classList.add('text-center', 'px-3');
      headerCell.innerText = columnName;
      headerRow.appendChild(headerCell);
    }
    table.appendChild(headerRow);

    // Loop through each row of data and create a new table row
    for (let row of rows) {
      const tableRow = document.createElement('tr');
      for (let columnName of columnNames) {
        // Get the property name for this column from the mapping
        const propertyName = columnMapping[columnName];
        // Check if the current row has data for this column
        if (row.hasOwnProperty(propertyName)) {
          const tableCell = document.createElement('td');
          tableCell.innerText = row[propertyName];
          tableCell.classList.add('p-2', 'text-center', 'font-size-13', 'font-family-system-ui');
          tableRow.appendChild(tableCell);
        } else if (columnName === 'Acknowledge') {
          const acknowledgeCell = document.createElement('td');
          acknowledgeCell.classList.add('text-center', 'p-2');
          const acknowledgeButton = document.createElement('button');
          acknowledgeButton.innerHTML = '&#10003;';
          acknowledgeButton.addEventListener('click', function () {
            const popoverContent = document.createElement('div');
            const inputLabel = document.createElement('label');
            inputLabel.innerText = "Hey there, what's your name?";
            const inputField = document.createElement('input');
            inputField.classList.add('m-3');
            inputField.setAttribute('type', 'text');
            inputField.setAttribute('required', true);
            const saveButton = document.createElement('button');
            saveButton.innerText = 'Save';
            saveButton.addEventListener('click', function () {
              // Cannot submit if input field is empty
              const inputFieldValue = inputField.value.trim();
              if (inputFieldValue === '') {
                inputField.classList.add('is-invalid');
                inputField.addEventListener('input', function () {
                  if (inputField.value.trim() !== '') {
                    inputField.classList.remove('is-invalid');
                  }
                });
              } else {
                console.log('Input:', inputFieldValue);
                console.log('ID:', row.id);
                popover.hide(); // Hide the popover
              }
            });
            
            popoverContent.appendChild(inputLabel);
            popoverContent.appendChild(inputField);
            popoverContent.appendChild(document.createElement('br'));
            popoverContent.appendChild(saveButton);
            const popover = new bootstrap.Popover(acknowledgeButton, {
              title: 'Gotcha!',
              content: popoverContent,
              html: true,
              placement: 'bottom'
            });
            popover.show();
          });
          acknowledgeButton.classList.add('btn', 'btn-success', 'rounded-2', 'px-3', 'py-1');
          acknowledgeButton.style.backgroundColor = '#1ab394';
          acknowledgeButton.style.borderColor = '#1ab394';

          // Add hover effect to button
          acknowledgeButton.addEventListener('mouseover', function () {
            acknowledgeButton.style.backgroundColor = '#238c77';
            acknowledgeButton.style.borderColor = '#238c77';
          });

          acknowledgeButton.addEventListener('mouseout', function () {
            acknowledgeButton.style.backgroundColor = '#1ab394';
            acknowledgeButton.style.borderColor = '#1ab394';
          });

          acknowledgeCell.appendChild(acknowledgeButton);
          tableRow.appendChild(acknowledgeCell);

        }
      }
      table.appendChild(tableRow);
    }

    // Wrap the table in a div element to make it scrollable
    const tableWrapper = document.createElement('div');
    tableWrapper.classList.add('table-responsive', 'table-wrapper');
    tableWrapper.style.height = '600px';
    tableWrapper.appendChild(table);

    // Add the table to the document
    document.body.appendChild(tableWrapper);
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });
