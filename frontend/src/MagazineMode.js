import React, { useState, useEffect, useCallback } from 'react';

export function MagazineMode() {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get articles from localStorage
    try {
      const storedArticles = localStorage.getItem('magazineArticles');
      if (storedArticles) {
        const parsedArticles = JSON.parse(storedArticles);
        setArticles(parsedArticles);
        console.log('Loaded articles for magazine mode:', parsedArticles.length);
      } else {
        console.log('No articles found in localStorage');
      }
    } catch (error) {
      console.error('Error parsing articles data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const nextPage = useCallback(() => {
    if (currentPage < articles.length - 1) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsFlipping(false);
      }, 300);
    }
  }, [currentPage, articles.length]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsFlipping(false);
      }, 300);
    }
  }, [currentPage]);

  useEffect(() => {
    // Add keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        nextPage();
      } else if (e.key === 'ArrowLeft') {
        prevPage();
      } else if (e.key === 'Escape') {
        window.close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextPage, prevPage]);

  const goToPage = (pageIndex) => {
    if (pageIndex !== currentPage && pageIndex >= 0 && pageIndex < articles.length) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(pageIndex);
        setIsFlipping(false);
      }, 300);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--lm-gray-50)',
        fontFamily: '"Helvetica Neue", Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📰</div>
          <h2 style={{ color: 'var(--lm-primary-navy)', marginBottom: '8px' }}>Loading Magazine...</h2>
          <p style={{ color: 'var(--lm-gray-500)' }}>Preparing your articles for magazine view</p>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--lm-gray-50)',
        fontFamily: '"Helvetica Neue", Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📰</div>
          <h2 style={{ color: 'var(--lm-primary-navy)', marginBottom: '8px' }}>No Articles Found</h2>
          <p style={{ color: 'var(--lm-gray-500)' }}>Please go back and select some articles to view in magazine mode</p>
          <button
            onClick={() => window.close()}
            style={{
              marginTop: '16px',
              backgroundColor: 'var(--lm-primary-navy)',
              color: 'var(--lm-white)',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  const currentArticle = articles[currentPage];

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#2c2c2c',
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Header Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: 'var(--lm-primary-navy)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <h1 style={{
            color: 'var(--lm-white)',
            margin: 0,
            fontSize: '18px',
            fontWeight: '700'
          }}>
            📖 Magazine Mode
          </h1>
          <span style={{
            color: 'var(--lm-primary-yellow)',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            Article {currentPage + 1} of {articles.length}
          </span>
        </div>
        
        <button
          onClick={() => window.close()}
          style={{
            backgroundColor: 'transparent',
            border: '2px solid var(--lm-primary-yellow)',
            color: 'var(--lm-primary-yellow)',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--lm-primary-yellow)';
            e.target.style.color = 'var(--lm-primary-navy)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = 'var(--lm-primary-yellow)';
          }}
        >
          Close Magazine
        </button>
      </div>

      {/* Main Magazine Content */}
      <div style={{
        paddingTop: '60px',
        height: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {/* Magazine Page */}
        <div style={{
          width: '800px',
          height: '700px',
          backgroundColor: 'var(--lm-white)',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          position: 'relative',
          transform: isFlipping ? 'rotateY(10deg) scale(0.95)' : 'rotateY(0deg) scale(1)',
          transition: 'all 0.3s ease',
          perspective: '1000px',
          overflow: 'hidden'
        }}>
          {/* Article Image */}
          {currentArticle.urlToImage && (
            <div style={{
              height: '250px',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--lm-gray-100)'
            }}>
              <img 
                src={currentArticle.urlToImage}
                alt={currentArticle.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '80px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '24px',
                right: '24px',
                pointerEvents: 'none'
              }}>
                <span style={{
                  backgroundColor: 'var(--lm-primary-navy)',
                  color: 'var(--lm-white)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {currentArticle.source?.name || 'News Source'}
                </span>
              </div>
            </div>
          )}

          {/* Article Content */}
          <div style={{
            padding: '24px',
            height: currentArticle.urlToImage ? '450px' : '676px',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* Article Header */}
            <div style={{
              borderBottom: '3px solid var(--lm-primary-yellow)',
              paddingBottom: '16px',
              marginBottom: '20px'
            }}>
              <h1 style={{
                color: 'var(--lm-primary-navy)',
                fontSize: '28px',
                fontWeight: '700',
                lineHeight: '1.2',
                margin: '0 0 12px 0'
              }}>
                {currentArticle.title}
              </h1>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px',
                color: 'var(--lm-gray-600)'
              }}>
                <span style={{ fontWeight: '600' }}>
                  {currentArticle.author || 'Staff Writer'}
                </span>
                <span>
                  {formatDate(currentArticle.publishedAt)}
                </span>
              </div>
            </div>

            {/* Article Description */}
            {currentArticle.description && (
              <div style={{
                fontSize: '18px',
                lineHeight: '1.6',
                color: 'var(--lm-gray-700)',
                marginBottom: '20px',
                fontStyle: 'italic',
                borderLeft: '4px solid var(--lm-primary-yellow)',
                paddingLeft: '16px'
              }}>
                {currentArticle.description}
              </div>
            )}

            {/* Article Content */}
            {currentArticle.content && (
              <div style={{
                fontSize: '16px',
                lineHeight: '1.7',
                color: 'var(--lm-gray-800)',
                marginBottom: '20px'
              }}>
                {currentArticle.content.replace(/\[\+\d+ chars\]/, '...')}
              </div>
            )}

            {/* Read Full Article Link */}
            <div style={{
              borderTop: '1px solid var(--lm-gray-200)',
              paddingTop: '16px',
              textAlign: 'center'
            }}>
              <a
                href={currentArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  backgroundColor: 'var(--lm-primary-navy)',
                  color: 'var(--lm-white)',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#004d73';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--lm-primary-navy)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Read Full Article →
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          style={{
            position: 'absolute',
            left: '50px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: currentPage === 0 ? 'var(--lm-gray-400)' : 'var(--lm-primary-navy)',
            border: 'none',
            color: 'var(--lm-white)',
            fontSize: '20px',
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={(e) => {
            if (currentPage > 0) {
              e.target.style.backgroundColor = '#004d73';
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage > 0) {
              e.target.style.backgroundColor = 'var(--lm-primary-navy)';
              e.target.style.transform = 'translateY(-50%) scale(1)';
            }
          }}
        >
          ←
        </button>

        <button
          onClick={nextPage}
          disabled={currentPage === articles.length - 1}
          style={{
            position: 'absolute',
            right: '50px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: currentPage === articles.length - 1 ? 'var(--lm-gray-400)' : 'var(--lm-primary-navy)',
            border: 'none',
            color: 'var(--lm-white)',
            fontSize: '20px',
            cursor: currentPage === articles.length - 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={(e) => {
            if (currentPage < articles.length - 1) {
              e.target.style.backgroundColor = '#004d73';
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage < articles.length - 1) {
              e.target.style.backgroundColor = 'var(--lm-primary-navy)';
              e.target.style.transform = 'translateY(-50%) scale(1)';
            }
          }}
        >
          →
        </button>
      </div>

      {/* Page Indicator */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: '12px 20px',
        borderRadius: '25px'
      }}>
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={() => goToPage(index)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: index === currentPage ? 'var(--lm-primary-yellow)' : 'var(--lm-gray-400)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (index !== currentPage) {
                e.target.style.backgroundColor = 'var(--lm-white)';
              }
            }}
            onMouseLeave={(e) => {
              if (index !== currentPage) {
                e.target.style.backgroundColor = 'var(--lm-gray-400)';
              }
            }}
          />
        ))}
      </div>

      {/* Keyboard Navigation Instructions */}
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'var(--lm-white)',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '12px',
        maxWidth: '200px'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '4px' }}>Navigation:</div>
        <div>← → Arrow keys or click arrows</div>
        <div>Click dots to jump to page</div>
      </div>
    </div>
  );
}

// Add keyboard navigation
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    const event = new CustomEvent('magazineKeydown', { detail: e.key });
    window.dispatchEvent(event);
  });
}
