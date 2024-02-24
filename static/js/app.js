// Define function to initialize the dashboard
function init() {
    // Fetch data from samples.json
    d3.json("samples.json").then((data) => {
        // Get sample names
        var names = data.names;

        // Populate dropdown menu with sample names
        var dropdownMenu = d3.select("#selDataset");
        names.forEach((name) => {
            dropdownMenu.append("option").text(name).property("value", name);
        });

        // Use the first sample to build initial plots
        var initialSample = names[0];
        buildCharts(initialSample);
        buildMetadata(initialSample);
    });
}

// Define function to build charts
function buildCharts(sample) {
    // Fetch data from samples.json
    d3.json("samples.json").then((data) => {
        // Filter data for selected sample
        var samples = data.samples.filter(s => s.id === sample)[0];
        
        // Bar chart
        var barData = [{
            x: samples.sample_values.slice(0, 10).reverse(),
            y: samples.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            text: samples.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        }];

        var barLayout = {
            title: "Top 10 OTUs Found",
            xaxis: { title: "Sample Values" }
        };

        Plotly.newPlot("bar", barData, barLayout);

        // Bubble chart
        var bubbleData = [{
            x: samples.otu_ids,
            y: samples.sample_values,
            text: samples.otu_labels,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            }
        }];

        var bubbleLayout = {
            title: "OTU ID vs Sample Values",
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample Values" }
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
}

// Define function to update metadata
function buildMetadata(sample) {
    // Fetch data from samples.json
    d3.json("samples.json").then((data) => {
        // Select metadata div
        var metadataDiv = d3.select("#sample-metadata");

        // Filter metadata for selected sample
        var metadata = data.metadata.filter(m => m.id == sample)[0];

        // Clear existing metadata
        metadataDiv.html("");

        // Populate metadata div with key-value pairs
        Object.entries(metadata).forEach(([key, value]) => {
            metadataDiv.append("p").text(`${key}: ${value}`);
        });
    });
}

// Define function to handle change in selected sample
function optionChanged(newSample) {
    // Update charts and metadata
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
init();
