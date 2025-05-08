/**
 * DataService for handling LinkedIn data operations
 * Manages data loading, parsing, and storage
 */
class DataService {
    constructor() {
        this.rawData = [];
        this.entries = [];
        this.isDataLoaded = false;
        this.currentData = [];
    }

    /**
     * Parse CSV file and convert to LinkedInEntry objects
     * @param {File} file - CSV file to parse
     * @returns {Promise} - Promise resolving with parsed data
     */
    parseCSVFile(file) {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                dynamicTyping: true,
                complete: (results) => {
                    if (results.errors && results.errors.length > 0) {
                        console.error('CSV parsing errors:', results.errors);
                    }
                    
                    this.rawData = results.data;
                    this.processData();
                    resolve(this.entries);
                },
                error: (error) => {
                    reject(error);
                }
            });
        });
    }

    /**
     * Process raw data into LinkedInEntry objects
     */
    processData() {
        this.entries = this.rawData
            .filter(row => Object.keys(row).length > 5) // Filter out empty or invalid rows
            .map(row => new LinkedInEntry(row));
        
        this.isDataLoaded = this.entries.length > 0;
        this.currentData = [...this.entries];
        
        // Save data to local storage for persistence
        this.saveToLocalStorage();
    }

    /**
     * Save processed data to localStorage
     */
    saveToLocalStorage() {
        try {
            localStorage.setItem('linkedInAnalyticsData', JSON.stringify(this.rawData));
        } catch (e) {
            console.error('Error saving data to localStorage:', e);
        }
    }

    /**
     * Load data from localStorage if available
     * @returns {boolean} - Whether data was successfully loaded
     */
    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem('linkedInAnalyticsData');
            if (savedData) {
                this.rawData = JSON.parse(savedData);
                this.processData();
                return true;
            }
        } catch (e) {
            console.error('Error loading data from localStorage:', e);
        }
        return false;
    }

    /**
     * Clear all data
     */
    clearData() {
        this.rawData = [];
        this.entries = [];
        this.currentData = [];
        this.isDataLoaded = false;
        localStorage.removeItem('linkedInAnalyticsData');
    }

    /**
     * Get data statistics for dashboard overview
     * @returns {Object} - Statistics object
     */
    getStatistics() {
        if (!this.isDataLoaded) return null;

        const stats = {
            totalEntries: this.entries.length,
            entryTypes: {},
            postsPerMonth: {},
            topEngagementAuthors: [],
            avgEngagement: 0
        };

        // Count entry types
        this.entries.forEach(entry => {
            if (entry.type) {
                stats.entryTypes[entry.type] = (stats.entryTypes[entry.type] || 0) + 1;
            }
        });

        // Group by month
        this.entries.forEach(entry => {
            if (entry.postedDate) {
                const monthYear = entry.postedDate.toLocaleString('en-US', { month: 'short', year: 'numeric' });
                stats.postsPerMonth[monthYear] = (stats.postsPerMonth[monthYear] || 0) + 1;
            }
        });

        // Calculate average engagement
        let totalEngagement = 0;
        this.entries.forEach(entry => {
            totalEngagement += entry.numLikes + entry.numComments + entry.numShares;
        });
        stats.avgEngagement = totalEngagement / this.entries.length;

        // Find top authors by engagement
        const authorEngagement = {};
        this.entries.forEach(entry => {
            const engagement = entry.numLikes + entry.numComments + entry.numShares;
            if (!authorEngagement[entry.authorProfileId]) {
                authorEngagement[entry.authorProfileId] = {
                    name: entry.authorName,
                    profileId: entry.authorProfileId,
                    headline: entry.authorHeadline,
                    picture: entry.authorProfilePicture,
                    engagement: 0,
                    posts: 0
                };
            }
            authorEngagement[entry.authorProfileId].engagement += engagement;
            authorEngagement[entry.authorProfileId].posts += 1;
        });

        stats.topEngagementAuthors = Object.values(authorEngagement)
            .sort((a, b) => b.engagement - a.engagement)
            .slice(0, 5);

        return stats;
    }

    /**
     * Export filtered data as JSON
     * @param {Array} data - Data to export (defaults to current filtered data)
     * @returns {string} - JSON string
     */
    exportAsJSON(data = this.currentData) {
        return JSON.stringify(data.map(entry => entry.toJSON()), null, 2);
    }

    /**
     * Download data as JSON file
     * @param {Array} data - Data to export
     */
    downloadJSON(data = this.currentData) {
        const jsonStr = this.exportAsJSON(data);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'linkedin_data_export.json';
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }
}

// Initialize data service
const dataService = new DataService();
