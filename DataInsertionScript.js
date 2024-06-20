require("dotenv").config();
require("./Connection/connection.js");
const axios = require('axios');

const kindergardenModel = require('./Models/kindergardenModel.js');
const schoolModel = require('./Models/schoolModel.js');
const socialTeenagerProjectModel = require('./Models/socialTeenagerProjectModel.js');
const socialChildProjectModel = require('./Models/socialChildProjectModel.js');


const startTime = new Date();
console.log("Execution Start")

// Function to flatten properties
const flattenProperties = (properties) => {
    const flattened = {};
    for (const key in properties) {
        if (key == "ID") {
            if (properties[key] == properties["OBJECTID"]) {

                flattened["D_ID"] = properties[key];
            } else {
                flattened["D_ID"] = properties["OBJECTID"];

            }
        } else {

            flattened[key] = properties[key];
        }
    }
    return flattened;
};

// Function to fetch data from a single API
const fetchDataFromAPI = async (url, category) => {
    try {
        const response = await axios.get(url);
        const data = response.data;

        // Process each feature
        const processedData = data.features.map((feature) => {
            const { geometry, properties } = feature;
            const flattenedProperties = flattenProperties(properties);
            return {
                lng: geometry.coordinates[0],
                lat: geometry.coordinates[1],
                category: category,
                ...flattenedProperties // flatten properties
            };
        });

        return processedData; // array of objects
    } catch (error) {
        console.error('Error fetching data from', url, error);
        return [];
    }
};

// Function to update the database model
const updateDatabase = async (model, data) => {
    try {
        console.log("Modification Starts=============");
        for (const item of data) {
            const { D_ID } = item; 

            const existingItem = await model.findOne({ 'data_obj.D_ID': D_ID }); // Check if the item already exists in the database

            if (existingItem != null) {
                await model.updateOne({ 'data_obj.D_ID':D_ID }, { $set: { data_obj: item } }); // Update the existing item if there are changes
                console.log("Updated Doc " + D_ID);
            } else {
                const finaldata = new model({ data_obj: item })
                await finaldata.save(); //insert new item
                console.log("inserted Doc " + D_ID);

            }

        }
        console.log("Modification Ends=============");
    } catch (error) {
        console.log('Error data insertion in', model, error.message);
    }
};

// Main function to fetch data from multiple APIs and update the database models
const InsertAndUpdateData = async () => {
    const apiUrls = [
        ['https://services6.arcgis.com/jiszdsDupTUO3fSM/arcgis/rest/services/Schulen_OpenData/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson', schoolModel, "School"],
        ['https://services6.arcgis.com/jiszdsDupTUO3fSM/arcgis/rest/services/Jugendberufshilfen_FL_1/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson', socialTeenagerProjectModel, "Social teenager project"],
        ['https://services6.arcgis.com/jiszdsDupTUO3fSM/arcgis/rest/services/Schulsozialarbeit_FL_1/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson', socialChildProjectModel, "Social child project"],
        ['https://services6.arcgis.com/jiszdsDupTUO3fSM/arcgis/rest/services/Kindertageseinrichtungen_Sicht/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson', kindergardenModel, "Kindergarden"]
    ];

    try {
        for (const [url, model, category] of apiUrls) {
            const data = await fetchDataFromAPI(url, category);
            await updateDatabase(model, data);
        }
    } catch (error) {
        console.error("Error in InsertAndUpdateData:", error);
    }
};

// Execute the main function
InsertAndUpdateData()
    .then(() => {
        const endTime = new Date();
        const totalTime = (endTime - startTime) / 1000;
        console.log(`Execution time: ${totalTime} seconds`);
        process.exit(0); // Exit with success code
    })
    .catch((error) => {
        console.error("Unhandled error:", error);
        process.exit(1); // Exit with non-zero code on unhandled error
    });
