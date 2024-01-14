// Storing URL provided using a variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Display the default plot
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to fetch JSON data from the URL
    // Once completed, the fetch data is logged to the console
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // Extracting an array of id names from the fetched JSON data
        let names = data.names;

        // Iterate through the names Array
        names.forEach((name) => {
            // A new option element is appended to the dropdown menu
            // Adds each name as an option in the dropdown menu
            dropdownMenu.append("option").text(name).property("value", name);
        });

        // Assign the first name to the variable "name"
        let name = names[0];

        // Call function to make the demographic info, bar chart, and bubble chart
        demo(name);
        bar(name);
        bubble(name);
        gauge(name);
    });
}

// Part 1 - The Demographics Info
function demo(selectedValue) {
    // Use D3 to fetch JSON data from the URL
    // Once completed, the fetch data is logged to the console
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // Extract the metadata array from the fetched JSON data
        let metadata = data.metadata;
        
        // Filter ths data based on the condition, where "id" matches the provided "selectedValue"
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
      
        // Assign the first object to variable "obj"
        let obj = filteredData[0]
        
        // Clears any existing child elements within the HTML element with the id "sample-metadata"
        d3.select("#sample-metadata").html("");
  
        // Convert the properties of the obj object into an array of [key, value] pairs.
        let entries = Object.entries(obj);
        
        // Iterate through the entries array
        // Append a new "h5" element to the HTML element with the id "sample-metadata" for each key-value pair
        entries.forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });

        // Log the entries
        console.log(entries);
    });
  }

// Part 2 - The Bar Chart
function bar(selectedValue) {
    // Use D3 to fetch JSON data from the URL
    // Once completed, the fetch data is logged to the console
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // Array of sample objects
        let samples = data.samples;

        // Filter data for the selected value, where id = selected value 
        let filteredData = samples.filter((sample) => sample.id === selectedValue);

        // Assign the first object to variable "obj"
        let obj = filteredData[0];
        
        // Create the trace for the bar chart
        let trace = [{
            // Slice the top 10 OTUs
            x: obj.sample_values.slice(0,10).reverse(),
            y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: obj.otu_labels.slice(0,10).reverse(),
            type: "bar",
            marker: {
                color: "rgb(179, 214, 180)"
            },
            orientation: "h"
        }];
        
        // plot the data in a bar chart using Plotly
        Plotly.newPlot("bar", trace);
    });
}

// Part 3 - The Bubble Chart
function bubble(selectedValue) {
    // Use D3 to fetch JSON data from the URL
    // Once completed, the fetch data is logged to the console
    d3.json(url).then((data) => {

        // Array of sample objects
        let samples = data.samples;
    
        // Filter data where id = selected value 
        let filteredData = samples.filter((sample) => sample.id === selectedValue);
    
        // Assign the first object to variable "obj"
        let obj = filteredData[0];
        
        // Create the trace for the bubble chart
        let trace = [{
            x: obj.otu_ids,
            y: obj.sample_values,
            text: obj.otu_labels,
            mode: "markers",
            marker: {
                size: obj.sample_values,
                color: obj.otu_ids,
                colorscale: "Viridis"
            }
        }];
    
        // Set X-axis title to "OTU ID"
        let layout = {
            xaxis: {title: "OTU ID"}
        };
    
        // Plot the data in a bubble chart using Plotly
        Plotly.newPlot("bubble", trace, layout);
    });
}

// Part 4 - The gauge chart 
function gauge(selectedValue) {
    // Use D3 to fetch JSON data from the URL
    // Once completed, the fetch data is logged to the console
    d3.json(url).then((data) => {

        // Extract an array of metadata objects from the data
        let metadata = data.metadata;
        
        // Filter data where id = selected value after converting their types 
        // (bc meta.id is in integer format and selectValue from is in string format)
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
      
        // Assign the first object to obj variable
        let obj = filteredData[0]

        // Create the trace for the gauge chart
        let trace = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: obj.wfreq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
            type: "indicator", 
            mode: "gauge+number",
            gauge: {
                axis: {range: [null, 10]}, 
                bar: {color: "rgb(16, 143, 11)"},
                steps: [
                    { range: [0, 1], color: "rgb(216, 237, 224)" },
                    { range: [1, 2], color: "rgb(197, 225, 202)" },
                    { range: [2, 3], color: "rgb(179, 214, 180)" },
                    { range: [3, 4], color: "rgb(160, 203, 158)" },
                    { range: [4, 5], color: "rgb(141, 193, 137)" },
                    { range: [5, 6], color: "rgb(122, 182, 115)" },
                    { range: [6, 7], color: "rgb(103, 172, 93)" },
                    { range: [7, 8], color: "rgb(85, 161, 72)" },
                    { range: [8, 9], color: "rgb(66, 150, 50)" },
                    { range: [9, 10], color: "rgb(47, 139, 28)" }
                ]
            }
        }];

         // Use Plotly to plot the data in a gauge chart
         Plotly.newPlot("gauge", trace);
    });
}

// Toggle to new plots when option changed
function optionChanged(selectedValue) {
    demo(selectedValue);
    bar(selectedValue);
    bubble(selectedValue);
    gauge(selectedValue)
}

init();
