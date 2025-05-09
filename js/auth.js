/**
 * Authentication module for LinkedIn Smart Analytics
 */
class AuthService {
    constructor() {
        this.isAuthenticated = false;
        this.credentials = {
            admin: 'goodlucky456'
        };
        this.checkAuthStatus();
    }

    /**
     * Check if user is already authenticated based on local storage
     */
    checkAuthStatus() {
        const userData = localStorage.getItem('linkedInAnalyticsUser');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                this.isAuthenticated = true;
                return true;
            } catch (e) {
                localStorage.removeItem('linkedInAnalyticsUser');
            }
        }
        return false;
    }

    /**
     * Authenticate user with provided credentials
     * @param {string} username - The username
     * @param {string} password - The password
     * @returns {boolean} - Authentication result
     */
    login(username, password) {
        if (this.credentials[username] && this.credentials[username] === password) {
            this.isAuthenticated = true;
            localStorage.setItem('linkedInAnalyticsUser', JSON.stringify({
                username,
                loginTime: new Date().toISOString()
            }));
            return true;
        }
        return false;
    }

    /**
     * Log out current user
     */
    logout() {
        this.isAuthenticated = false;
        localStorage.removeItem('linkedInAnalyticsUser');
    }
}

// Initialize auth service
const authService = new AuthService();
