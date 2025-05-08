/**
 * CardView component for displaying data in a card-based layout
 * Optimized for mobile viewing and provides a more visual interface
 */
class CardView {
    constructor(dataService, filterService, uiManager) {
        this.dataService = dataService;
        this.filterService = filterService;
        this.uiManager = uiManager;
        this.cardsContainer = document.getElementById('data-cards');
        this.cardPagination = document.getElementById('card-pagination');
        this.currentPage = 1;
        this.cardsPerPage = 6; // Fewer cards per page for better mobile experience
    }

    /**
     * Render the cards with current data
     */
    render() {
        if (!this.dataService.isDataLoaded) {
            this.cardsContainer.innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-info">
                        No data available. Please upload a CSV file.
                    </div>
                </div>
            `;
            this.cardPagination.innerHTML = '';
            return;
        }
        
        const data = this.filterService.applyFilters();
        
        if (data.length === 0) {
            this.cardsContainer.innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-warning">
                        No matches found for the current filters.
                    </div>
                </div>
            `;
            this.cardPagination.innerHTML = '';
            return;
        }
        
        // Calculate pagination
        const totalPages = Math.ceil(data.length / this.cardsPerPage);
        if (this.currentPage > totalPages) {
            this.currentPage = 1;
        }
        
        const startIndex = (this.currentPage - 1) * this.cardsPerPage;
        const endIndex = Math.min(startIndex + this.cardsPerPage, data.length);
        const currentPageData = data.slice(startIndex, endIndex);
        
        // Clear existing cards
        this.cardsContainer.innerHTML = '';
        
        // Add cards for current page
        currentPageData.forEach(entry => {
            const colDiv = document.createElement('div');
            colDiv.className = 'col-md-6 col-lg-4 mb-4 fade-in';
            
            // Create card HTML
            colDiv.innerHTML = `
                <div class="card h-100 profile-card shadow-sm" data-index="${data.indexOf(entry)}">
                    <div class="card-header bg-light">
                        <div class="d-flex align-items-center">
                            <img src="${entry.authorProfilePicture || 'https://via.placeholder.com/60'}" 
                                 alt="${entry.authorName}" class="profile-image me-3">
                            <div>
                                <h5 class="mb-0">${entry.authorName}</h5>
                                <p class="text-muted small mb-0">${entry.authorHeadline || ''}</p>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <span class="badge ${entry.type === 'article' ? 'bg-primary' : 'bg-secondary'} mb-2">
                                ${entry.type}${entry.isRepost ? ' (Repost)' : ''}
                            </span>
                            <p class="small text-muted mb-1">Posted: ${entry.getFormattedDate()}</p>
                        </div>
                        <p class="card-text">${entry.getContentPreview(150)}</p>
                    </div>
                    <div class="card-footer bg-white">
                        <div class="row text-center">
                            <div class="col">
                                <i class="far fa-thumbs-up"></i> ${entry.numLikes || 0}
                            </div>
                            <div class="col">
                                <i class="far fa-comment"></i> ${entry.numComments || 0}
                            </div>
                            <div class="col">
                                <i class="far fa-share-square"></i> ${entry.numShares || 0}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            this.cardsContainer.appendChild(colDiv);
        });
        
        // Add click handlers for cards
        document.querySelectorAll('.profile-card').forEach(card => {
            card.addEventListener('click', () => {
                const index = parseInt(card.getAttribute('data-index'));
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
            this.cardPagination.innerHTML = '';
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
        
        // Page numbers - simplified for mobile
        const maxPages = 3; // Show fewer page numbers for mobile
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
        
        this.cardPagination.innerHTML = paginationHTML;
        
        // Add event listeners for pagination links
        document.querySelectorAll('#card-pagination .page-link').forEach(link => {
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
     * Refresh the card view
     */
    refresh() {
        this.render();
    }

    /**
     * Set the number of cards per page
     * @param {number} cards - Number of cards per page
     */
    setCardsPerPage(cards) {
        this.cardsPerPage = cards;
        this.currentPage = 1;
        this.render();
    }
}
