export function Articles(params) {
    console.log('Articles component received params:', params);
    console.log('params.data:', params.data);
    console.log('params.data.articles:', params.data.articles);
    console.log('params.query:', params.query);
    
    let articles = (params.data.articles) ? params.data.articles : [];
    console.log('Processed articles array:', articles, 'length:', articles.length);
    
    let queryName = (params.query.queryName) ? params.query.queryName : "Latest News";
    let articleCount = (params.data.totalResults) ? params.data.totalResults : 0;
    
    // Determine if we're actually loading or just have no data
    const isLoading = params.loading || false; // You can pass this from parent
    const hasSearched = params.query && (params.query.q || params.query.country); // Check if a search has been performed
    const isInitialLoad = !hasSearched && articles.length === 0;
    
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const truncateText = (text, maxLength) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <div className="articles-container">
            {/* Articles Header */}
            <div className="articles-header">
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid #e0e0e0',
                    marginBottom: '1rem',
                    fontSize: '0.9rem',
                    color: 'white'
                }}>
                    <span style={{fontWeight: '600', color: 'white'}}>{queryName}</span>
                    <div style={{display: 'flex', gap: '1.5rem', color: 'white'}}>
                        <span>{articles.length} Displayed</span>
                        <span>{articleCount.toLocaleString()} Found</span>
                        <span>{new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Articles List */}
            {isLoading ? (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <span style={{marginLeft: '1rem'}}>Loading articles...</span>
                </div>
            ) : articles.length === 0 ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '3rem 1rem', 
                    color: '#666',
                    background: '#f8f9fa',
                    borderRadius: '15px',
                    border: '2px dashed #dee2e6'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                        {isInitialLoad ? '📰' : '🔍'}
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#2c3e50' }}>
                        {isInitialLoad ? 'Welcome to NewsDash Pro!' : 'No Articles Found'}
                    </div>
                    <div style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                        {isInitialLoad ? (
                            <>
                                Create your first query using the form on the left<br/>
                                or select from saved queries to get started.
                            </>
                        ) : (
                            <>
                                No articles match your search criteria.<br/>
                                Try adjusting your search terms or filters.
                            </>
                        )}
                    </div>
                </div>
            ) : (
                articles.map((item, idx) => {
                    if (!item) {
                        return (
                            <div key={idx} className="article-item">
                                <div className="error-message">
                                    ⚠️ Article data unavailable
                                </div>
                            </div>
                        );
                    }

                    if (!item.title || item.title === "[Removed]") {
                        return (
                            <div key={idx} className="article-item">
                                <div className="article-title" style={{color: '#888'}}>
                                    🚫 Article Removed or Unavailable
                                </div>
                                <div className="article-description">
                                    This article has been removed from the source or is no longer available.
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={idx} className="article-item">
                            <div className="article-title">
                                {truncateText(item.title, 120)}
                            </div>
                            
                            {item.description && (
                                <div className="article-description">
                                    {truncateText(item.description, 200)}
                                </div>
                            )}

                            <div className="article-meta">
                                <div>
                                    {item.source?.name && (
                                        <span className="article-source">
                                            📰 {item.source.name}
                                        </span>
                                    )}
                                    {item.author && (
                                        <span style={{marginLeft: '1rem', color: '#666'}}>
                                            ✍️ {truncateText(item.author, 30)}
                                        </span>
                                    )}
                                </div>
                                
                                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                                    {item.publishedAt && (
                                        <span className="article-date">
                                            🕒 {formatDate(item.publishedAt)}
                                        </span>
                                    )}
                                    {item.url && (
                                        <a 
                                            href={item.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="read-more-btn"
                                        >
                                            📖 Read More
                                        </a>
                                    )}
                                </div>
                            </div>

                            {item.urlToImage && (
                                <div style={{marginTop: '1rem'}}>
                                    <img 
                                        src={item.urlToImage} 
                                        alt={item.title}
                                        style={{
                                            width: '100%',
                                            maxHeight: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            border: '1px solid #eee'
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}