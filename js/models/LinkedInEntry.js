/**
 * LinkedInEntry class representing a single LinkedIn profile entry
 * Provides methods for parsing and accessing LinkedIn data
 */
class LinkedInEntry {
    /**
     * Create a new LinkedIn entry from CSV data
     * @param {Object} data - Raw CSV data object
     */
    constructor(data) {
        // Basic properties
        this.inputUrl = data.inputUrl || '';
        this.isRepost = data.isRepost === 'True';
        this.urn = data.urn || '';
        this.url = data.url || '';
        this.timeSincePosted = data.timeSincePosted || '';
        this.shareUrn = data.shareUrn || '';
        this.text = data.text || '';
        
        // Parse attributes if they exist
        try {
            this.attributes = typeof data.attributes === 'string' ? 
                JSON.parse(data.attributes.replace(/'/g, '"')) : 
                data.attributes || [];
        } catch (e) {
            this.attributes = [];
        }
        
        // Parse comments if they exist
        try {
            this.comments = typeof data.comments === 'string' ? 
                JSON.parse(data.comments.replace(/'/g, '"')) : 
                data.comments || [];
        } catch (e) {
            this.comments = [];
        }
        
        // Parse reactions if they exist
        try {
            this.reactions = typeof data.reactions === 'string' ? 
                JSON.parse(data.reactions.replace(/'/g, '"')) : 
                data.reactions || [];
        } catch (e) {
            this.reactions = [];
        }
        
        // Engagement metrics
        this.numShares = parseInt(data.numShares) || 0;
        this.numLikes = parseInt(data.numLikes) || 0;
        this.numComments = parseInt(data.numComments) || 0;
        this.canReact = data.canReact === 'True';
        this.canPostComments = data.canPostComments === 'True';
        this.canShare = data.canShare === 'True';
        this.commentingDisabled = data.commentingDisabled === 'True';
        this.allowedCommentersScope = data.allowedCommentersScope || '';
        this.rootShare = data.rootShare === 'True';
        this.shareAudience = data.shareAudience || '';
        
        // Author information
        this.author = data.author || '';
        this.authorProfileId = data.authorProfileId || '';
        this.authorProfilePicture = data.authorProfilePicture || '';
        this.authorType = data.authorType || '';
        this.authorHeadline = data.authorHeadline || '';
        this.authorName = data.authorName || '';
        this.authorProfileUrl = data.authorProfileUrl || '';
        this.authorUrn = data.authorUrn || '';
        this.authorFollowersCount = data.authorFollowersCount || '';
        
        // Timestamp information
        this.postedAtTimestamp = parseInt(data.postedAtTimestamp) || 0;
        this.postedAtISO = data.postedAtISO || '';
        this.postedDate = this.postedAtISO ? new Date(this.postedAtISO) : null;
        
        // Additional media
        this.images = data.images || '';
        this.resharedPost = data.resharedPost || '';
        this.linkedinVideo = data.linkedinVideo || '';
        this.document = data.document || '';

        // Determine post type based on inputURL
        this.type = this.determinePostType();
    }

    /**
     * Determine the post type based on inputURL and various dictionaries
     * @returns {string} - POST, COMMENT, REACTION, or REPOST
     */
    determinePostType() {
        // Get the public ID from inputURL (string after 'in/')
        const inputUrlPublicId = this.inputUrl.split('in/')[1]?.split('?')[0];
        if (!inputUrlPublicId) return 'UNKNOWN';

        // Check if it's a repost
        if (this.isRepost) {
            return 'REPOST';
        }

        // Check if it's a post (author URL matches inputURL)
        const authorUrlBase = this.authorProfileUrl.split('?')[0];
        const inputUrlBase = this.inputUrl.split('?')[0];
        if (authorUrlBase === inputUrlBase) {
            return 'POST';
        }

        // Check if it's a comment
        if (Array.isArray(this.comments)) {
            for (const comment of this.comments) {
                if (comment.commentorPublicId === inputUrlPublicId) {
                    return 'COMMENT';
                }
            }
        }

        // Check if it's a reaction
        if (Array.isArray(this.reactions)) {
            for (const reaction of this.reactions) {
                if (reaction.reactorPublicId === inputUrlPublicId) {
                    return 'REACTION';
                }
            }
        }

        return 'UNKNOWN';
    }
    
    /**
     * Get short summary of the entry
     * @returns {string} - Summary string
     */
    getSummary() {
        let summary = `${this.type} by ${this.authorName}`;
        if (this.isRepost) {
            summary += ' (Repost)';
        }
        return summary;
    }
    
    /**
     * Get formatted posted date
     * @returns {string} - Formatted date string
     */
    getFormattedDate() {
        if (!this.postedDate) return this.timeSincePosted || 'Unknown';
        
        return this.postedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    /**
     * Get short content preview
     * @param {number} maxLength - Maximum characters to display
     * @returns {string} - Truncated content preview
     */
    getContentPreview(maxLength = 100) {
        if (!this.text) return 'No content';
        
        if (this.text.length <= maxLength) {
            return this.text;
        } else {
            return this.text.substring(0, maxLength) + '...';
        }
    }
    
    /**
     * Calculate engagement rate
     * @returns {number} - Engagement rate percentage
     */
    getEngagementRate() {
        const totalEngagements = this.numLikes + this.numComments + this.numShares;
        const followersCount = parseInt(this.authorFollowersCount.replace(/,/g, '')) || 1;
        
        return (totalEngagements / followersCount) * 100;
    }
    
    /**
     * Convert to JSON for export
     * @returns {Object} - JSON representation of the entry
     */
    toJSON() {
        return {
            type: this.type,
            isRepost: this.isRepost,
            urn: this.urn,
            url: this.url,
            text: this.text,
            numShares: this.numShares,
            numLikes: this.numLikes,
            numComments: this.numComments,
            author: this.authorName,
            authorProfileId: this.authorProfileId,
            authorHeadline: this.authorHeadline,
            authorProfileUrl: this.authorProfileUrl,
            postedAtISO: this.postedAtISO,
            engagementRate: this.getEngagementRate().toFixed(2) + '%'
        };
    }
}
