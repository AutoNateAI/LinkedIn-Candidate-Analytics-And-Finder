/**
 * TableView component for displaying tabular data
 * Handles pagination and row rendering
 */
class TableView {
    constructor(dataService, filterService, uiManager) {
        this.dataService = dataService;
        this.filterService = filterService;
        this.uiManager = uiManager;
        this.tableBody = document.getElementById('data-table-body');
        this.tablePagination = document.getElementById('table-pagination');
        this.currentPage = 1;
        this.rowsPerPage = 10;
        
        this.initEventListeners();
    }

    /**
     * Initialize event listeners for the table
     */
    initEventListeners() {
        // Add sort functionality to table headers
        const tableHeaders = document.querySelectorAll('#data-table th[data-sort]');
        tableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const field = header.getAttribute('data-sort');
                const newDirection = 
                    this.filterService.sortField === field && this.filterService.sortDirection === 'desc' ? 'asc' : 'desc';
                
                // Update sort indicators
                tableHeaders.forEach(h => h.classList.remove('sorted-asc', 'sorted-desc'));
                header.classList.add(`sorted-${newDirection}`);
                
                // Apply new sort
                this.filterService.setSort(field, newDirection);
                this.refresh();
            });
        });
    }

    /**
     * Render the table with current data
     */
    render() {
        if (!this.dataService.isDataLoaded) {
            this.tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">No data available. Please upload a CSV file.</td>
                </tr>
            `;
            this.tablePagination.innerHTML = '';
            return;
        }
        
        const data = this.filterService.applyFilters();
        
        if (data.length === 0) {
            this.tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">No matches found for the current filters.</td>
                </tr>
            `;
            this.tablePagination.innerHTML = '';
            return;
        }
        
        // Calculate pagination
        const totalPages = Math.ceil(data.length / this.rowsPerPage);
        if (this.currentPage > totalPages) {
            this.currentPage = 1;
        }
        
        const startIndex = (this.currentPage - 1) * this.rowsPerPage;
        const endIndex = Math.min(startIndex + this.rowsPerPage, data.length);
        const currentPageData = data.slice(startIndex, endIndex);
        
        // Clear existing rows
        this.tableBody.innerHTML = '';
        
        // Add rows for current page
        currentPageData.forEach(entry => {
            const row = document.createElement('tr');
            row.className = 'fade-in';
            row.innerHTML = `
                <td>${entry.type}${entry.isRepost ? ' <span class="badge bg-secondary">Repost</span>' : ''}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${entry.authorProfilePicture || 'https://via.placeholder.com/40'}" 
                             alt="${entry.authorName}" class="me-2 rounded-circle" width="40" height="40">
                        <span>${entry.authorName}</span>
                    </div>
                </td>
                <td title="${entry.authorHeadline || ''}">${entry.authorHeadline ? (entry.authorHeadline.length > 30 ? entry.authorHeadline.substring(0, 27) + '...' : entry.authorHeadline) : ''}</td>
                <td>${entry.getFormattedDate()}</td>
                <td>${entry.numLikes || 0}</td>
                <td>${entry.numComments || 0}</td>
                <td>${entry.numShares || 0}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary view-details" data-index="${data.indexOf(entry)}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            
            this.tableBody.appendChild(row);
        });
        
        // Add click handlers for detail buttons
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                this.uiManager.openDetailModal(data[index]);
            });
        });
        
        // Render pagination
        this.renderPagination(totalPages);
    }

    /**
     * Render pagination controls
     * @param {number} totalPages - Total number of pages
     */
    renderPagination(totalPages) {
        if (totalPages <= 1) {
            this.tablePagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage - 1}">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;
        
        // Page numbers
        const maxPages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
        let endPage = Math.min(totalPages, startPage + maxPages - 1);
        
        if (endPage - startPage < maxPages - 1) {
            startPage = Math.max(1, endPage - maxPages + 1);
        }
        
        if (startPage > 1) {
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="1">1</a>
                </li>
            `;
            if (startPage > 2) {
                paginationHTML += `
                    <li class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>
                `;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `
                    <li class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>
                `;
            }
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>
                </li>
            `;
        }
        
        // Next button
        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage + 1}">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;
        
        this.tablePagination.innerHTML = paginationHTML;
        
        // Add event listeners for pagination links
        document.querySelectorAll('#table-pagination .page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (!link.parentElement.classList.contains('disabled')) {
                    const page = parseInt(link.getAttribute('data-page'));
                    this.currentPage = page;
                    this.render();
                }
            });
        });
    }

    /**
     * Refresh the table view
     */
    refresh() {
        this.render();
    }

    /**
     * Set the number of rows per page
     * @param {number} rows - Number of rows per page
     */
    setRowsPerPage(rows) {
        this.rowsPerPage = rows;
        this.currentPage = 1;
        this.render();
    }
}
