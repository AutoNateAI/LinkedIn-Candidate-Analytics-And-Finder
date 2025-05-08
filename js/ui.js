/**
 * UI handling module for LinkedIn Smart Analytics
 * Handles navigation, section visibility and responsive design
 */
class UIManager {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.content = document.querySelector('.content');
        this.sidebarToggles = document.querySelectorAll('.sidebar-toggle');
        this.navLinks = document.querySelectorAll('.sidebar ul li a');
        this.contentSections = document.querySelectorAll('.content-section');
        this.contentTitle = document.getElementById('content-title');
        this.goToUploadBtn = document.getElementById('go-to-upload');
        
        this.initEventListeners();
    }

    /**
     * Initialize all event listeners for UI elements
     */
    initEventListeners() {
        // Sidebar toggle for mobile view
        this.sidebarToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        });

        // Navigation links
        this.navLinks.forEach(link => {
            if (link.getAttribute('data-section')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const section = link.getAttribute('data-section');
                    this.showSection(section);
                });
            }
        });

        // Go to upload button on dashboard
        if (this.goToUploadBtn) {
            this.goToUploadBtn.addEventListener('click', () => {
                this.showSection('upload');
            });
        }

        // View toggle buttons
        const tableViewBtn = document.getElementById('view-mode-table');
        const cardViewBtn = document.getElementById('view-mode-cards');
        
        if (tableViewBtn && cardViewBtn) {
            tableViewBtn.addEventListener('click', () => this.toggleViewMode('table'));
            cardViewBtn.addEventListener('click', () => this.toggleViewMode('cards'));
        }
    }

    /**
     * Toggle sidebar visibility for mobile view
     */
    toggleSidebar() {
        this.sidebar.classList.toggle('active');
        this.content.classList.toggle('active');
    }

    /**
     * Show a specific content section and update navigation
     * @param {string} sectionId - The section ID to show
     */
    showSection(sectionId) {
        // Update active nav link
        this.navLinks.forEach(link => {
            const parent = link.parentElement;
            if (link.getAttribute('data-section') === sectionId) {
                parent.classList.add('active');
            } else {
                parent.classList.remove('active');
            }
        });

        // Update visible section
        this.contentSections.forEach(section => {
            if (section.id === `${sectionId}-section`) {
                section.classList.add('active');
                // Update content title
                this.contentTitle.textContent = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
            } else {
                section.classList.remove('active');
            }
        });

        // Close sidebar on mobile after navigation
        if (window.innerWidth < 768) {
            this.sidebar.classList.remove('active');
            this.content.classList.remove('active');
        }
    }

    /**
     * Toggle between table and card views in analysis section
     * @param {string} mode - The view mode ('table' or 'cards')
     */
    toggleViewMode(mode) {
        const tableView = document.getElementById('table-view');
        const cardView = document.getElementById('card-view');
        const tableViewBtn = document.getElementById('view-mode-table');
        const cardViewBtn = document.getElementById('view-mode-cards');

        if (mode === 'table') {
            tableView.classList.remove('d-none');
            cardView.classList.add('d-none');
            tableViewBtn.classList.remove('btn-outline-primary');
            tableViewBtn.classList.add('btn-primary');
            cardViewBtn.classList.remove('btn-primary');
            cardViewBtn.classList.add('btn-outline-primary');
        } else {
            tableView.classList.add('d-none');
            cardView.classList.remove('d-none');
            cardViewBtn.classList.remove('btn-outline-primary');
            cardViewBtn.classList.add('btn-primary');
            tableViewBtn.classList.remove('btn-primary');
            tableViewBtn.classList.add('btn-outline-primary');
        }
    }

    /**
     * Show loading spinner while processing data
     * @param {boolean} show - Whether to show or hide the spinner
     */
    showLoading(show) {
        const uploadProgress = document.getElementById('upload-progress');
        if (show) {
            uploadProgress.classList.remove('d-none');
            const progressBar = uploadProgress.querySelector('.progress-bar');
            let width = 0;
            const interval = setInterval(() => {
                if (width >= 90) {
                    clearInterval(interval);
                } else {
                    width += 5;
                    progressBar.style.width = width + '%';
                }
            }, 100);
        } else {
            const progressBar = uploadProgress.querySelector('.progress-bar');
            progressBar.style.width = '100%';
            setTimeout(() => {
                uploadProgress.classList.add('d-none');
                progressBar.style.width = '0%';
            }, 500);
        }
    }

    /**
     * Display alert message
     * @param {string} message - Message to display
     * @param {string} type - Alert type (success, warning, danger)
     * @param {string} container - ID of container to show alert in
     */
    showAlert(message, type = 'info', container = 'upload-form') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} mt-3`;
        alertDiv.textContent = message;
        
        const targetContainer = document.getElementById(container);
        targetContainer.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    /**
     * Open detail modal with entry information
     * @param {Object} entry - The entry data to display
     */
    openDetailModal(entry) {
        const modal = new bootstrap.Modal(document.getElementById('entry-detail-modal'));
        const contentElement = document.getElementById('entry-detail-content');
        
        // Build modal content based on entry data
        let content = `
            <div class="row mb-3">
                <div class="col-md-2">
                    <img src="${entry.authorProfilePicture || 'https://via.placeholder.com/100'}" 
                         class="img-fluid rounded-circle" alt="${entry.authorName}">
                </div>
                <div class="col-md-10">
                    <h5>${entry.authorName}</h5>
                    <p class="text-muted">${entry.authorHeadline || 'LinkedIn User'}</p>
                    <a href="${entry.authorProfileUrl}" target="_blank" class="btn btn-sm btn-outline-primary">
                        <i class="fab fa-linkedin"></i> View Profile
                    </a>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-12">
                    <h6>Post Content</h6>
                    <div class="card">
                        <div class="card-body">
                            ${entry.text.replace(/\n/g, '<br>') || 'No content'}
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-4">
                    <div class="card text-center">
                        <div class="card-body">
                            <h3>${entry.numLikes || 0}</h3>
                            <p>Likes</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card text-center">
                        <div class="card-body">
                            <h3>${entry.numComments || 0}</h3>
                            <p>Comments</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card text-center">
                        <div class="card-body">
                            <h3>${entry.numShares || 0}</h3>
                            <p>Shares</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <p><strong>Type:</strong> ${entry.type}</p>
                    <p><strong>Posted:</strong> ${entry.postedAtISO}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>URL:</strong> <a href="${entry.url}" target="_blank">View on LinkedIn</a></p>
                    <p><strong>Candidate ID:</strong> ${entry.authorProfileId}</p>
                </div>
            </div>
        `;
        
        contentElement.innerHTML = content;
        modal.show();
    }
}

// Initialize UI manager
const uiManager = new UIManager();
