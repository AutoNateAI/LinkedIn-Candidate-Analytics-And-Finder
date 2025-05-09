/**
 * ChartView component for visualizing LinkedIn data
 * Uses Chart.js to create interactive charts
 */
class ChartView {
    constructor(dataService) {
        this.dataService = dataService;
        this.charts = {};
    }

    /**
     * Initialize dashboard charts
     */
    initDashboardCharts() {
        if (!this.dataService.isDataLoaded) return;
        
        const stats = this.dataService.getStatistics();
        if (!stats) return;
        
        // Clear any existing charts
        Object.values(this.charts).forEach(chart => chart.destroy());
        this.charts = {};
        
        // Create dashboard container for charts
        const dashboardContent = document.getElementById('dashboard-content');
        dashboardContent.innerHTML = `
            <div class="row mb-4">
                <div class="col-lg-3 col-md-6 mb-3">
                    <div class="card shadow-sm text-center">
                        <div class="card-body">
                            <h2>${stats.totalEntries}</h2>
                            <p class="text-muted mb-0">Total Entries</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-3">
                    <div class="card shadow-sm text-center">
                        <div class="card-body">
                            <h2>${Object.keys(stats.entryTypes).length}</h2>
                            <p class="text-muted mb-0">Entry Types</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-3">
                    <div class="card shadow-sm text-center">
                        <div class="card-body">
                            <h2>${stats.avgEngagement.toFixed(1)}</h2>
                            <p class="text-muted mb-0">Avg. Engagement</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-3">
                    <div class="card shadow-sm text-center">
                        <div class="card-body">
                            <h2>${Object.keys(stats.postsPerMonth).length}</h2>
                            <p class="text-muted mb-0">Months Analyzed</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-lg-6 mb-3">
                    <div class="card shadow-sm">
                        <div class="card-header">
                            <h5 class="card-title">Entry Types Distribution</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="entry-types-chart"></canvas>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 mb-3">
                    <div class="card shadow-sm">
                        <div class="card-header">
                            <h5 class="card-title">Posts Timeline</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="posts-timeline-chart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-12">
                    <div class="card shadow-sm">
                        <div class="card-header">
                            <h5 class="card-title">Top Engagement Authors</h5>
                        </div>
                        <div class="card-body">
                            <div class="row" id="top-authors-container">
                                ${this.renderTopAuthorsHTML(stats.topEngagementAuthors)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Initialize charts after elements are created
        this.initEntryTypesChart(stats.entryTypes);
        this.initPostsTimelineChart(stats.postsPerMonth);
    }

    /**
     * Create Entry Types pie chart
     * @param {Object} typesData - Object with entry type counts
     */
    initEntryTypesChart(typesData) {
        const ctx = document.getElementById('entry-types-chart').getContext('2d');
        
        // Extract data
        const labels = Object.keys(typesData);
        const data = Object.values(typesData);
        
        // Define colors for each type
        const backgroundColors = [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
        ];
        
        this.charts.entryTypes = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors.slice(0, labels.length),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Create Posts Timeline bar chart
     * @param {Object} timelineData - Object with post counts by month
     */
    initPostsTimelineChart(timelineData) {
        const ctx = document.getElementById('posts-timeline-chart').getContext('2d');
        
        // Sort months chronologically
        const sortedMonths = Object.keys(timelineData).sort((a, b) => {
            const monthsOrder = {'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 
                                'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11};
            
            const [aMonth, aYear] = a.split(' ');
            const [bMonth, bYear] = b.split(' ');
            
            if (aYear !== bYear) {
                return parseInt(aYear) - parseInt(bYear);
            }
            
            return monthsOrder[aMonth] - monthsOrder[bMonth];
        });
        
        const data = sortedMonths.map(month => timelineData[month]);
        
        this.charts.postsTimeline = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedMonths,
                datasets: [{
                    label: 'Number of Posts',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }

    /**
     * Render HTML for top authors section
     * @param {Array} authors - Array of top author objects
     * @returns {string} - HTML string
     */
    renderTopAuthorsHTML(authors) {
        if (!authors || authors.length === 0) {
            return '<div class="col-12 text-center">No author data available</div>';
        }
        
        return authors.map(author => {
            return `
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card card-body">
                        <div class="d-flex align-items-center mb-3">
                            <img src="${author.picture || 'https://via.placeholder.com/60'}" 
                                 alt="${author.name}" class="profile-image me-3">
                            <div>
                                <h5 class="mb-0">${author.name}</h5>
                                <p class="text-muted small mb-0">${author.headline || ''}</p>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div class="text-center">
                                <h5>${author.engagement}</h5>
                                <p class="text-muted small mb-0">Total Engagement</p>
                            </div>
                            <div class="text-center">
                                <h5>${author.posts}</h5>
                                <p class="text-muted small mb-0">Posts</p>
                            </div>
                            <div class="text-center">
                                <h5>${Math.round(author.engagement / author.posts)}</h5>
                                <p class="text-muted small mb-0">Avg. per Post</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Refresh all charts
     */
    refresh() {
        this.initDashboardCharts();
    }

    /**
     * Destroy all charts to prevent memory leaks
     */
    destroy() {
        Object.values(this.charts).forEach(chart => chart.destroy());
        this.charts = {};
    }
}
