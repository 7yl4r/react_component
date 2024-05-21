console.log("Downloading DwC .csv and creating .json...");

const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// URL of the CSV file
const csvUrl = 'https://raw.githubusercontent.com/tdwg/dwc/master/dist/all_dwc_vertical.csv';

// Path to save the downloaded CSV file
const csvFilePath = path.join(__dirname, 'downloaded-dwc.csv');

// Path to save the resulting JSON file
const jsonFilePath = path.join(__dirname, 'downloaded-dwc.json');

// Template object
const templateJson = {
  "name_vocabulary": "Darwin Core",
  "standard_name": null,
  "alerts": {
    "threshold_min": null,
    "threshold_max": null
  },
  "display_name": {
    "en": null
  },
  "display_description": {
    "en": null
  },
  "canonical_unit_id": null,
  "preferred_metric_unit_id": null,
  "preferred_imperial_unit_id": null,
  "units": []
};


// Function to download the CSV file
async function downloadCsv(url, filePath) {
  const response = await axios({
    method: 'get',
    url: url,
    responseType: 'stream'
  });

  const writer = fs.createWriteStream(filePath);

  return new Promise((resolve, reject) => {
    response.data.pipe(writer);
    let error = null;
    writer.on('error', err => {
      error = err;
      writer.close();
      reject(err);
    });
    writer.on('close', () => {
      if (!error) {
        resolve(true);
      }
    });
  });
}

// Function to parse the CSV file and create an array of objects
function parseCsv(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv({ headers: false }))
      .on('data', (row) => {
        const standardName = Object.values(row)[0]; // Get the value from the single column
        const newObj = {
          ...templateJson,
          standard_name: standardName
        };
        results.push(newObj);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

// Function to write JSON data to a file
function writeJsonToFile(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

// Main function to download, parse the CSV file, and write the JSON array to a file
async function main() {
  try {
    await downloadCsv(csvUrl, csvFilePath);
    const data = await parseCsv(csvFilePath);
    await writeJsonToFile(jsonFilePath, data);
    console.log(`JSON data written to ${jsonFilePath}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();