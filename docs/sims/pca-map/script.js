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

            // Remove axis labels, tick marks, and their reserved space
            layout.xaxis = layout.xaxis || {};
            layout.yaxis = layout.yaxis || {};
            layout.xaxis.title = { text: '', standoff: 0 };
            layout.yaxis.title = { text: '', standoff: 0 };
            layout.xaxis.showticklabels = false;
            layout.yaxis.showticklabels = false;
            layout.xaxis.ticks = '';
            layout.yaxis.ticks = '';
            layout.margin = { t: 35, r: 10, b: 10, l: 10 };

            // Move legend down
            layout.legend = layout.legend || {};
            layout.legend.y = 0.95;
            layout.legend.yanchor = 'top';

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

            // Wire up legend control buttons
            const numTraces = plotData.data.length;

            document.getElementById('btn-check-all').addEventListener('click', function() {
                Plotly.restyle(plotDiv, 'visible', Array(numTraces).fill(true));
            });

            document.getElementById('btn-uncheck-all').addEventListener('click', function() {
                Plotly.restyle(plotDiv, 'visible', Array(numTraces).fill('legendonly'));
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

    // Update footer text with counts
    const footerStats = document.getElementById('footer-stats');
    if (footerStats) {
        footerStats.textContent = `Generated ${totalPoints} datapoints mapped to ${subjectAreas} subjects from MicroSim metadata embeddings using PCA dimensionality reduction`;
    }
}
