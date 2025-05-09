/**
 * FilterService for handling data filtering and sorting
 * Provides advanced filtering capabilities for LinkedIn data
 */
class FilterService {
    constructor(dataService) {
        this.dataService = dataService;
        this.currentFilters = {
            date: 'all',
            dateFrom: null,
            dateTo: null,
            types: ['all'],
            authorHeadline: '',
            textSearch: '',
            highComments: false,
            highLikes: false
        };
        this.sortField = 'posted';
        this.sortDirection = 'desc';
    }

    /**
     * Apply all current filters to the data
     * @returns {Array} - Filtered array of entries
     */
    applyFilters() {
        if (!this.dataService.isDataLoaded) return [];
        
        let filteredData = [...this.dataService.entries];
        
        // Apply date filter
        filteredData = this.filterByDate(filteredData);
        
        // Apply type filter
        filteredData = this.filterByType(filteredData);
        
        // Apply headline filter
        if (this.currentFilters.authorHeadline) {
            filteredData = filteredData.filter(entry => {
                return entry.authorHeadline && 
                       entry.authorHeadline.toLowerCase().includes(this.currentFilters.authorHeadline.toLowerCase());
            });
        }
        
        // Apply text search
        if (this.currentFilters.textSearch) {
            filteredData = filteredData.filter(entry => {
                return entry.text && entry.text.toLowerCase().includes(this.currentFilters.textSearch.toLowerCase());
            });
        }
        
        // Apply engagement filters
        if (this.currentFilters.highComments) {
            // Filter for entries with comment count in top 25%
            const commentCounts = this.dataService.entries.map(e => e.numComments).sort((a, b) => b - a);
            const threshold = commentCounts[Math.floor(commentCounts.length * 0.25)] || 1;
            filteredData = filteredData.filter(entry => entry.numComments >= threshold);
        }
        
        if (this.currentFilters.highLikes) {
            // Filter for entries with like count in top 25%
            const likeCounts = this.dataService.entries.map(e => e.numLikes).sort((a, b) => b - a);
            const threshold = likeCounts[Math.floor(likeCounts.length * 0.25)] || 1;
            filteredData = filteredData.filter(entry => entry.numLikes >= threshold);
        }
        
        // Apply sorting
        filteredData = this.sortData(filteredData);
        
        // Update current data in data service
        this.dataService.currentData = filteredData;
        
        return filteredData;
    }

    /**
     * Filter entries by date
     * @param {Array} data - Data to filter
     * @returns {Array} - Date filtered data
     */
    filterByDate(data) {
        if (this.currentFilters.date === 'all') return data;
        
        const now = new Date();
        let fromDate;
        
        switch(this.currentFilters.date) {
            case 'day':
                fromDate = new Date(now.setDate(now.getDate() - 1));
                break;
            case 'week':
                fromDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'month':
                fromDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case 'custom':
                if (this.currentFilters.dateFrom) {
                    fromDate = new Date(this.currentFilters.dateFrom);
                    const toDate = this.currentFilters.dateTo ? new Date(this.currentFilters.dateTo) : new Date();
                    return data.filter(entry => {
                        if (!entry.postedDate) return false;
                        return entry.postedDate >= fromDate && entry.postedDate <= toDate;
                    });
                }
                break;
        }
        
        if (fromDate) {
            return data.filter(entry => entry.postedDate && entry.postedDate >= fromDate);
        }
        
        return data;
    }

    /**
     * Filter entries by type
     * @param {Array} data - Data to filter
     * @returns {Array} - Type filtered data
     */
    filterByType(data) {
        if (this.currentFilters.types.includes('all')) return data;
        
        return data.filter(entry => {
            // Check for specific types
            if (this.currentFilters.types.includes(entry.type.toLowerCase())) return true;
            
            // Handle repost type
            if (this.currentFilters.types.includes('repost') && entry.isRepost) return true;
            
            return false;
        });
    }

    /**
     * Sort data by the selected field and direction
     * @param {Array} data - Data to sort
     * @returns {Array} - Sorted data
     */
    sortData(data) {
        return data.sort((a, b) => {
            let aValue, bValue;
            
            switch(this.sortField) {
                case 'type':
                    aValue = a.type.toLowerCase();
                    bValue = b.type.toLowerCase();
                    break;
                case 'author':
                    aValue = a.authorName.toLowerCase();
                    bValue = b.authorName.toLowerCase();
                    break;
                case 'headline':
                    aValue = (a.authorHeadline || '').toLowerCase();
                    bValue = (b.authorHeadline || '').toLowerCase();
                    break;
                case 'posted':
                    aValue = a.postedAtTimestamp || 0;
                    bValue = b.postedAtTimestamp || 0;
                    break;
                case 'likes':
                    aValue = a.numLikes || 0;
                    bValue = b.numLikes || 0;
                    break;
                case 'comments':
                    aValue = a.numComments || 0;
                    bValue = b.numComments || 0;
                    break;
                case 'shares':
                    aValue = a.numShares || 0;
                    bValue = b.numShares || 0;
                    break;
                default:
                    aValue = a.postedAtTimestamp || 0;
                    bValue = b.postedAtTimestamp || 0;
            }
            
            // Compare values based on sort direction
            if (this.sortDirection === 'asc') {
                if (aValue < bValue) return -1;
                if (aValue > bValue) return 1;
                return 0;
            } else {
                if (aValue > bValue) return -1;
                if (aValue < bValue) return 1;
                return 0;
            }
        });
    }

    /**
     * Set filter values
     * @param {Object} filters - Filter options to set
     */
    setFilters(filters) {
        this.currentFilters = { ...this.currentFilters, ...filters };
    }

    /**
     * Set sort parameters
     * @param {string} field - Field to sort by
     * @param {string} direction - Sort direction ('asc' or 'desc')
     */
    setSort(field, direction) {
        this.sortField = field;
        this.sortDirection = direction;
    }

    /**
     * Reset all filters to default values
     */
    resetFilters() {
        this.currentFilters = {
            date: 'all',
            dateFrom: null,
            dateTo: null,
            types: ['all'],
            authorHeadline: '',
            textSearch: '',
            highComments: false,
            highLikes: false
        };
    }
}

// Initialize filter service
const filterService = new FilterService(dataService);
