// MicroSim PCA Map - Interactive Plotly Visualization
// Loads data from data.json and renders an interactive scatter plot

document.addEventListener('DOMContentLoaded', function() {
    const plotDiv = document.getElementById('pca-plot');

    // Load the data
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load data.json');
            }
            return response.json();
        })
        .then(plotData => {
            // Update stats from data
            updateStats(plotData.data);

            // Configure responsive layout
            const layout = plotData.layout;
            layout.autosize = true;

            // Use the HTML <title> as the chart title (single source of truth)
            layout.title = {
                text: document.title,
                font: { size: 20 },
                x: 0.5,
                xanchor: 'center'
            };

            // Config for interactivity
            const config = {
                responsive: true,
                displayModeBar: true,
                modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                displaylogo: false
            };

            // Create the plot
            Plotly.newPlot(plotDiv, plotData.data, layout, config);

            // Handle click events to open MicroSim URLs
            plotDiv.on('plotly_click', function(data) {
                const point = data.points[0];
                if (point.customdata) {
                    const url = point.customdata;
                    if (url.startsWith('http')) {
                        window.open(url, '_blank');
                    }
                }
            });

            // Handle window resize
            window.addEventListener('resize', function() {
                Plotly.Plots.resize(plotDiv);
            });
        })
        .catch(error => {
            console.error('Error loading PCA data:', error);
            plotDiv.innerHTML = '<p style="color: red; padding: 20px;">Error loading visualization data. Please check that data.json exists.</p>';
        });
});

function updateStats(data) {
    // Calculate total MicroSims
    let totalPoints = 0;
    let subjectAreas = 0;

    data.forEach(trace => {
        if (trace.x && Array.isArray(trace.x)) {
            totalPoints += trace.x.length;
        }
        subjectAreas++;
    });

    // Update stat values if elements exist
    const microsimsStat = document.getElementById('stat-microsims');
    const subjectsStat = document.getElementById('stat-subjects');

    if (microsimsStat) microsimsStat.textContent = totalPoints;
    if (subjectsStat) subjectsStat.textContent = subjectAreas;
}
