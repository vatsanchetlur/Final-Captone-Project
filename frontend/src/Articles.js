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
                    padding: '0.4rem 0', /* Reduced from 0.75rem to 0.4rem */
                    borderBottom: '1px solid #e0e0e0',
                    marginBottom: '0.5rem', /* Reduced from 1rem to 0.5rem */
                    fontSize: '0.8rem', /* Reduced from 0.9rem to 0.8rem */
                    color: 'white'
                }}>
                    <span style={{fontWeight: '600', color: 'white', fontSize: '0.85rem'}}>{queryName}</span>
                    <div style={{display: 'flex', gap: '1rem', color: 'white', fontSize: '0.75rem'}}> {/* Reduced gap from 1.5rem to 1rem and font size */}
                        <span>{articles.length} Displayed</span>
                        <span>{articleCount.toLocaleString()} Found</span>
                        <span>{new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Articles List */}
            {isLoading ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                    borderRadius: '16px',
                    border: '2px solid #0ea5e9',
                    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.1)'
                }}>
                    <div className="loading-spinner" style={{ marginBottom: '1.5rem' }}></div>
                    <div style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: '600', 
                        color: '#0369a1',
                        marginBottom: '0.5rem'
                    }}>
                        Fetching Latest News
                    </div>
                    <div style={{ 
                        color: '#0284c7', 
                        fontSize: '0.95rem',
                        lineHeight: '1.5'
                    }}>
                        Please wait while we gather the most recent articles for you...
                    </div>
                </div>
            ) : articles.length === 0 ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '4rem 2rem', 
                    background: isInitialLoad 
                        ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' 
                        : 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                    borderRadius: '16px',
                    border: isInitialLoad 
                        ? '2px solid #22c55e' 
                        : '2px solid #f59e0b',
                    boxShadow: isInitialLoad 
                        ? '0 4px 12px rgba(34, 197, 94, 0.1)' 
                        : '0 4px 12px rgba(245, 158, 11, 0.1)'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
                        {isInitialLoad ? '🎯' : '🔍'}
                    </div>
                    <div style={{ 
                        fontSize: '1.4rem', 
                        fontWeight: '700', 
                        marginBottom: '1rem', 
                        color: isInitialLoad ? '#166534' : '#92400e'
                    }}>
                        {isInitialLoad ? 'Ready to Get Started!' : 'No Results Found'}
                    </div>
                    <div style={{ 
                        fontSize: '1.05rem', 
                        lineHeight: '1.6',
                        color: isInitialLoad ? '#15803d' : '#a16207',
                        maxWidth: '500px',
                        margin: '0 auto'
                    }}>
                        {isInitialLoad ? (
                            <>
                                Welcome to <strong>NewsDash</strong>! Create your first search using the form on the left, or select from your saved searches to discover the latest news from around the world.
                            </>
                        ) : (
                            <>
                                We couldn't find any articles matching your search criteria. Try using different keywords, selecting a different country, or adjusting your filters to get better results.
                            </>
                        )}
                    </div>
                    {!isInitialLoad && (
                        <div style={{
                            marginTop: '2rem',
                            padding: '1rem',
                            background: 'rgba(245, 158, 11, 0.1)',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            color: '#a16207'
                        }}>
                            💡 <strong>Tip:</strong> Try broader search terms or check if the selected country has available news sources.
                        </div>
                    )}
                </div>
            ) : (
                articles.map((item, idx) => {
                    if (!item) {
                        return (
                            <div key={idx} style={{
                                padding: '2rem',
                                textAlign: 'center',
                                background: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)',
                                border: '1px solid #fc8181',
                                borderRadius: '12px',
                                margin: '1rem 0',
                                boxShadow: '0 2px 8px rgba(252, 129, 129, 0.1)'
                            }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
                                <div style={{ 
                                    fontSize: '1.1rem', 
                                    fontWeight: '600', 
                                    color: '#c53030',
                                    marginBottom: '0.5rem'
                                }}>
                                    Content Unavailable
                                </div>
                                <div style={{ 
                                    color: '#744210', 
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5'
                                }}>
                                    We're having trouble loading this article. Please try refreshing the page.
                                </div>
                            </div>
                        );
                    }

                    if (!item.title || item.title === "[Removed]") {
                        return (
                            <div key={idx} style={{
                                padding: '2rem',
                                textAlign: 'center',
                                background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                                border: '1px solid #a0aec0',
                                borderRadius: '12px',
                                margin: '1rem 0',
                                boxShadow: '0 2px 8px rgba(160, 174, 192, 0.1)'
                            }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚫</div>
                                <div style={{ 
                                    fontSize: '1.1rem', 
                                    fontWeight: '600', 
                                    color: '#4a5568',
                                    marginBottom: '0.5rem'
                                }}>
                                    Article No Longer Available
                                </div>
                                <div style={{ 
                                    color: '#718096', 
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5'
                                }}>
                                    This content has been removed by the publisher or is temporarily unavailable.
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
                                            maxHeight: '300px', /* Increased from 200px to 300px for better image display */
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