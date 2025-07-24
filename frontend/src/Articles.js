export function Articles(params) {
  let articles = (params.data.articles) ? params.data.articles : [];
  let queryName = (params.query.queryName) ? params.query.queryName : "No Query";
  let articleCount = (params.data.totalResults) ? params.data.totalResults : 0;

  const openMagazineMode = () => {
    console.log('Magazine mode button clicked');
    console.log('Articles available:', articles.length);
    
    if (articles.length === 0) {
      console.log('No articles to display in magazine mode');
      return;
    }
    
    // Store articles in localStorage
    localStorage.setItem('magazineArticles', JSON.stringify(articles));
    localStorage.setItem('magazineQuery', queryName);
    
    console.log('Articles stored in localStorage');
    
    // Open magazine mode in new window
    const magazineUrl = `${window.location.origin}${window.location.pathname}?mode=magazine`;
    console.log('Opening magazine URL:', magazineUrl);
    
    const newWindow = window.open(magazineUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    
    if (!newWindow) {
      console.error('Failed to open new window - popup may be blocked');
      alert('Please allow popups for this site to use Magazine Mode');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Check if this is showing top headlines (no search query)
  const isTopHeadlines = !params.query.q || params.query.q.trim() === '';
  const headerText = isTopHeadlines ? "Today's Top Headlines" : "Search Results";
  const subHeaderText = isTopHeadlines 
    ? `${articleCount} breaking stories from top news sources`
    : `Query: "${queryName}" • ${articleCount} results found`;

  return (
    <div style={{ padding: '15px' }}>
      <div style={{ 
        marginBottom: '20px', 
        borderBottom: '2px solid var(--lm-primary-yellow)', 
        paddingBottom: '15px' 
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '8px'
        }}>
          <h2 className="article-header">{headerText}</h2>
          
          {articles.length > 0 && (
            <button
              onClick={openMagazineMode}
              style={{
                backgroundColor: 'var(--lm-primary-yellow)',
                color: 'var(--lm-primary-navy)',
                border: '2px solid var(--lm-primary-yellow)',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--lm-primary-navy)';
                e.target.style.color = 'var(--lm-primary-yellow)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--lm-primary-yellow)';
                e.target.style.color = 'var(--lm-primary-navy)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              📖 View in Magazine Mode
            </button>
          )}
        </div>
        
        <p className="article-subheader">
          {subHeaderText}
        </p>
      </div>

      {articles.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          backgroundColor: 'var(--lm-white)',
          border: '2px dashed var(--lm-gray-300)',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📰</div>
          <p style={{ 
            color: 'var(--lm-primary-navy)', 
            fontWeight: '600', 
            margin: '0 0 8px 0',
            fontSize: '18px'
          }}>
            {isTopHeadlines 
              ? "Loading today's top headlines..." 
              : "No articles found"
            }
          </p>
          <p style={{ 
            color: 'var(--lm-gray-500)', 
            margin: '0',
            fontSize: '14px'
          }}>
            {isTopHeadlines 
              ? "Please wait while we fetch the latest news..."
              : "Try adjusting your search terms or check back later for new stories"
            }
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {articles.map((article, index) => (
            <div 
              key={index}
              className="lm-card lm-card--clickable"
              onClick={() => window.open(article.url, '_blank')}
              style={{ 
                display: 'grid',
                gridTemplateColumns: article.urlToImage ? '200px 1fr' : '1fr',
                gap: '20px',
                alignItems: 'start'
              }}
            >
              {/* Article Image */}
              {article.urlToImage && (
                <div style={{ 
                  width: '200px',
                  height: '120px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  backgroundColor: '#f5f5f5'
                }}>
                  <img 
                    src={article.urlToImage} 
                    alt={article.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Article Content */}
              <div style={{ minWidth: 0 }}>
                <h3 style={{ 
                  margin: '0 0 12px 0', 
                  fontSize: '18px',
                  fontWeight: '600',
                  lineHeight: '1.4',
                  color: '#1a1a1a'
                }}>
                  {article.title}
                </h3>
                
                <div style={{ 
                  fontSize: '12px', 
                  color: '#888', 
                  marginBottom: '12px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {article.source?.name && (
                    <span style={{ 
                      backgroundColor: '#f0f0f0', 
                      padding: '2px 8px', 
                      borderRadius: '12px',
                      fontWeight: '500'
                    }}>
                      {article.source.name}
                    </span>
                  )}
                  {article.author && <span>By {article.author}</span>}
                  {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
                </div>

                {article.description && article.description !== "[Removed]" && (
                  <p style={{ 
                    margin: '0', 
                    fontSize: '14px', 
                    lineHeight: '1.5',
                    color: '#555'
                  }}>
                    {article.description}
                  </p>
                )}
                
                <div style={{ 
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid #f0f0f0',
                  fontSize: '12px',
                  color: '#0066cc',
                  fontWeight: '500'
                }}>
                  Read full article →
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}