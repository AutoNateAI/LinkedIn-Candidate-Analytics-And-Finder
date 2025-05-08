/**
 * Main application script for LinkedIn Smart Analytics
 * Initializes and coordinates all components
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    const tableView = new TableView(dataService, filterService, uiManager);
    const cardView = new CardView(dataService, filterService, uiManager);
    const chartView = new ChartView(dataService);
    
    // Check authentication status
    if (authService.isAuthenticated) {
        showApp();
        // Try to load data from localStorage
        if (dataService.loadFromLocalStorage()) {
            updateDashboard();
            tableView.render();
            cardView.render();
        }
    } else {
        showLogin();
    }
    
    // Login form submission
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (authService.login(username, password)) {
            showApp();
            // Try to load data from localStorage
            if (dataService.loadFromLocalStorage()) {
                updateDashboard();
                tableView.render();
                cardView.render();
            }
        } else {
            document.getElementById('login-error').classList.remove('d-none');
        }
    });
    
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        authService.logout();
        showLogin();
    });
    
    // File upload handling
    document.getElementById('upload-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const fileInput = document.getElementById('csv-file');
        
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            
            // Show loading
            uiManager.showLoading(true);
            
            // Process CSV file
            dataService.parseCSVFile(file).then(entries => {
                uiManager.showLoading(false);
                
                if (entries.length > 0) {
                    uiManager.showAlert(`Successfully loaded ${entries.length} entries.`, 'success');
                    updateDashboard();
                    // Switch to dashboard view
                    uiManager.showSection('dashboard');
                } else {
                    uiManager.showAlert('No valid data found in the CSV file.', 'warning');
                }
            }).catch(error => {
                uiManager.showLoading(false);
                uiManager.showAlert(`Error processing file: ${error.message}`, 'danger');
                console.error('CSV parsing error:', error);
            });
        } else {
            uiManager.showAlert('Please select a CSV file to upload.', 'warning');
        }
    });
    
    // Filter application
    document.getElementById('apply-filters').addEventListener('click', function() {
        // Collect filter values
        const dateFilter = document.getElementById('date-filter').value;
        let dateFrom = null;
        let dateTo = null;
        
        if (dateFilter === 'custom') {
            dateFrom = document.getElementById('date-from').value;
            dateTo = document.getElementById('date-to').value;
        }
        
        const typeFilterSelect = document.getElementById('type-filter');
        const selectedTypes = Array.from(typeFilterSelect.selectedOptions).map(option => option.value);
        
        const authorHeadline = document.getElementById('author-headline-filter').value;
        const textSearch = document.getElementById('text-search').value;
        const highComments = document.getElementById('high-comments-filter').checked;
        const highLikes = document.getElementById('high-likes-filter').checked;
        
        // Apply filters
        filterService.setFilters({
            date: dateFilter,
            dateFrom: dateFrom,
            dateTo: dateTo,
            types: selectedTypes,
            authorHeadline: authorHeadline,
            textSearch: textSearch,
            highComments: highComments,
            highLikes: highLikes
        });
        
        // Update views
        tableView.render();
        cardView.render();
    });
    
    // Reset filters
    document.getElementById('reset-filters').addEventListener('click', function() {
        // Reset filter inputs
        document.getElementById('date-filter').value = 'all';
        document.getElementById('custom-date-range').classList.add('d-none');
        document.getElementById('date-from').value = '';
        document.getElementById('date-to').value = '';
        
        const typeFilterSelect = document.getElementById('type-filter');
        for (let i = 0; i < typeFilterSelect.options.length; i++) {
            typeFilterSelect.options[i].selected = typeFilterSelect.options[i].value === 'all';
        }
        
        document.getElementById('author-headline-filter').value = '';
        document.getElementById('text-search').value = '';
        document.getElementById('high-comments-filter').checked = false;
        document.getElementById('high-likes-filter').checked = false;
        
        // Reset filter service
        filterService.resetFilters();
        
        // Update views
        tableView.render();
        cardView.render();
    });
    
    // Export filtered data
    document.getElementById('export-filtered').addEventListener('click', function() {
        dataService.downloadJSON();
        
        // Add pulse effect to button
        this.classList.add('btn-pulse');
        setTimeout(() => {
            this.classList.remove('btn-pulse');
        }, 1500);
    });
    
    // Custom date range toggle
    document.getElementById('date-filter').addEventListener('change', function() {
        const customDateRange = document.getElementById('custom-date-range');
        if (this.value === 'custom') {
            customDateRange.classList.remove('d-none');
        } else {
            customDateRange.classList.add('d-none');
        }
    });
    
    /**
     * Show login screen
     */
    function showLogin() {
        document.getElementById('login-container').classList.remove('d-none');
        document.getElementById('app-container').classList.add('d-none');
    }
    
    /**
     * Show main application
     */
    function showApp() {
        document.getElementById('login-container').classList.add('d-none');
        document.getElementById('app-container').classList.remove('d-none');
    }
    
    /**
     * Update dashboard with current data
     */
    function updateDashboard() {
        if (dataService.isDataLoaded) {
            chartView.initDashboardCharts();
        }
    }
});
