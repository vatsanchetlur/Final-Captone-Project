import { CustomModal } from './CustomModal';
import { useState } from 'react';

export function QueryForm(params) {
    // Modal state management
    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        onConfirm: null,
        showCancel: false
    });
    
    // Helper function to show modal
    const showModal = (title, message, type = 'info', onConfirm = null, showCancel = false) => {
        setModal({
            isOpen: true,
            title,
            message,
            type,
            onConfirm,
            showCancel
        });
    };
    
    const closeModal = () => {
        setModal(prev => ({ ...prev, isOpen: false }));
    };

    const handleChange = (event) => {
        let newQueryObject = { ...params.formObject };
        newQueryObject[event.target.name] = event.target.value;
        params.setFormObject(newQueryObject);
    };

    function onSubmitClick(event) {
        event.preventDefault();
        
        // Check if user is logged in for creation
        if (!params.currentUser) {
            showModal(
                'Login Required',
                'You need to be logged in to create and save new search queries.\n\nPlease use the login form above to sign in first.',
                'warning'
            );
            return;
        }

        // Validation
        if (!params.formObject.queryName || params.formObject.queryName.trim() === '') {
            showModal(
                'Query Name Required',
                'Please provide a descriptive name for your search query.\n\nThis helps you identify it in your saved searches later.',
                'warning'
            );
            return;
        }

        // NewsAPI parameter validation
        const hasKeywords = params.formObject.q && params.formObject.q.trim().length > 0;
        const hasCountry = params.formObject.country && params.formObject.country.trim().length > 0;
        const hasCategory = params.formObject.category && params.formObject.category.trim().length > 0;

        // Check for invalid combinations
        if (hasKeywords && hasCountry) {
            showModal(
                'Invalid Search Combination',
                'NewsAPI doesn\'t support combining search keywords with country selection.\n\nChoose one approach:\n• Use keywords only (for global search)\n• Use country + category (for regional headlines)\n\nPlease adjust your search parameters and try again.',
                'error'
            );
            return;
        }

        // Must have either keywords OR country (with optional category)
        if (!hasKeywords && !hasCountry) {
            showModal(
                'Search Parameters Required',
                'Please provide search criteria:\n\nOption 1: Enter keywords to search globally\nOption 2: Select a country for regional headlines\n\nAt least one search parameter is required to continue.',
                'warning'
            );
            return;
        }

        // Check guest user limits (assuming non-admin users are guests)
        if (!isAdmin) {
            // Note: Guest limit checking would need to be implemented
            // based on saved queries count - this is just a placeholder
            // The actual implementation would check the savedQueries array length
        }

        params.submitToParent(params.formObject);
    };

    function currentUserIsAdmin(){
        if(params.currentUser){
            // Handle both string and object formats
            if(typeof params.currentUser === 'string'){
                return params.currentUser === "admin";
            }
            if(params.currentUser.user){
                return params.currentUser.user === "admin";
            }
        }
        return false;
    }

    // Helper function to get user display name
    const getUserDisplayName = (currentUser) => {
        if (!currentUser) return '';
        if (typeof currentUser === 'string') return currentUser;
        if (currentUser.user) return currentUser.user;
        return 'User';
    };

    const isLoggedIn = Boolean(params.currentUser);
    const isAdmin = currentUserIsAdmin();
    const userDisplayName = getUserDisplayName(params.currentUser);

    return (
        <div className="query-form">
            <form onSubmit={onSubmitClick}>
                {/* Basic Fields */}
                <div className="form-group">
                    <label htmlFor="queryName">Search Name</label>
                    <input 
                        type="text" 
                        id="queryName" 
                        name="queryName" 
                        value={params.formObject.queryName || ''} 
                        onChange={handleChange}
                        placeholder="Enter a memorable name for your search"
                        disabled={!isLoggedIn}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="q">Search Keywords</label>
                    <input 
                        type="text" 
                        id="q" 
                        name="q" 
                        value={params.formObject.q || ''} 
                        onChange={handleChange}
                        placeholder="e.g., artificial intelligence, climate change, sports"
                        disabled={!isLoggedIn}
                    />
                    <small className="field-help">
                        Use this for global keyword search. Cannot be combined with country/category.
                    </small>
                </div>

                <div className="form-section-divider">
                    <span>OR</span>
                </div>

                <div className="form-group">
                    <label htmlFor="country">Country Headlines</label>
                    <select 
                        id="country" 
                        name="country" 
                        value={params.formObject.country || ''} 
                        onChange={handleChange}
                        disabled={!isLoggedIn}
                    >
                        <option value="">Select a country for top headlines</option>
                        <option value="us">United States</option>
                        <option value="gb">United Kingdom</option>
                        <option value="ca">Canada</option>
                        <option value="au">Australia</option>
                        <option value="de">Germany</option>
                        <option value="fr">France</option>
                        <option value="in">India</option>
                        <option value="jp">Japan</option>
                    </select>
                    <small className="field-help">
                        Get top headlines from a specific country. Can be combined with category below.
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category (Optional)</label>
                    <select 
                        id="category" 
                        name="category" 
                        value={params.formObject.category || ''} 
                        onChange={handleChange}
                        disabled={!isLoggedIn || !params.formObject.country}
                    >
                        <option value="">All Categories</option>
                        <option value="business">Business</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="general">General</option>
                        <option value="health">Health</option>
                        <option value="science">Science</option>
                        <option value="sports">Sports</option>
                        <option value="technology">Technology</option>
                    </select>
                    <small className="field-help">
                        Filter country headlines by category. Only works with country selection.
                    </small>
                </div>

                {/* Admin-Only Advanced Fields */}
                {isAdmin && (
                    <div className="admin-panel">
                        <div className="admin-panel-header">
                            � Advanced Search Options
                        </div>

                        <div className="form-group">
                            <label htmlFor="language">Language</label>
                            <select 
                                id="language" 
                                name="language" 
                                value={params.formObject.language || ''} 
                                onChange={handleChange}
                            >
                                <option value="">All Languages</option>
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                                <option value="it">Italian</option>
                                <option value="pt">Portuguese</option>
                                <option value="ru">Russian</option>
                                <option value="zh">Chinese</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="pageSize">Articles Per Page</label>
                            <input
                                type="number"
                                id="pageSize"
                                name="pageSize"
                                min={1}
                                max={100}
                                value={params.formObject.pageSize || 20}
                                onChange={handleChange}
                                placeholder="Number of articles (1-100)"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="sortBy">Sort By</label>
                            <select 
                                id="sortBy" 
                                name="sortBy" 
                                value={params.formObject.sortBy || ''} 
                                onChange={handleChange}
                            >
                                <option value="">Relevancy</option>
                                <option value="publishedAt">Published Date</option>
                                <option value="popularity">Popularity</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Login Status Message */}
                {!isLoggedIn && (
                    <div style={{
                        background: '#fff3cd',
                        border: '1px solid #ffeaa7',
                        color: '#856404',
                        padding: '1rem',
                        borderRadius: '0',
                        marginTop: '1rem',
                        textAlign: 'center'
                    }}>
                        Please log in to create new searches
                    </div>
                )}

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={!isLoggedIn}
                >
                    {isLoggedIn ? 'Search News' : 'Login Required'}
                </button>

                {/* User Status Info */}
                {isLoggedIn && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        background: isAdmin ? '#fff0f0' : '#f8f8f8',
                        color: isAdmin ? '#cc0000' : '#666',
                        textAlign: 'center',
                        border: isAdmin ? '1px solid #cc0000' : '1px solid #e0e0e0',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        {isAdmin ? `ADMIN USER (${userDisplayName}) - ALL FEATURES AVAILABLE` : `STANDARD USER (${userDisplayName}) - BASIC FEATURES ONLY`}
                    </div>
                )}
            </form>

            {/* Modal Component - for alerts and confirmations */}
            {modal.isOpen && (
                <CustomModal 
                    isOpen={modal.isOpen} 
                    title={modal.title} 
                    message={modal.message} 
                    onClose={closeModal}
                    onConfirm={modal.onConfirm}
                    showCancel={modal.showCancel}
                    type={modal.type}
                />
            )}
        </div>
    );
}