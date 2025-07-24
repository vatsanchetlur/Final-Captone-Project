import { useState, useEffect, useRef } from 'react';

export function TopStoriesScroll() {
  const [topStories, setTopStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    fetchTopStories();
  }, []);

  useEffect(() => {
    if (topStories.length > 0 && !isPaused) {
      const container = scrollContainerRef.current;
      if (!container) return;

      let scrollPosition = container.scrollLeft;
      const scrollSpeed = 0.3; // pixels per frame - slower for better readability
      const cardWidth = 295; // 280px width + 15px gap
      const totalWidth = cardWidth * topStories.length;

      const animate = () => {
        if (!isPaused && container) {
          scrollPosition += scrollSpeed;
          
          // Reset to beginning when we've scrolled through one complete set
          if (scrollPosition >= totalWidth) {
            scrollPosition = 0;
          }
          
          container.scrollLeft = scrollPosition;
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [topStories, isPaused]);

  async function fetchTopStories() {
    try {
      const response = await fetch('/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: "",
          country: "us",
          language: "en",
          pageSize: 10
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTopStories(data.articles || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching top stories:', error);
      setLoading(false);
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="breaking-news">
        <h3 className="breaking-news__header">
          🔥 Breaking News
        </h3>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: 'var(--lm-gray-500)',
          fontSize: '14px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          Loading top stories...
        </div>
      </div>
    );
  }

  return (
    <div className="breaking-news">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        maxWidth: '1200px',
        margin: '0 auto 12px auto'
      }}>
        <h3 className="breaking-news__header">
          🔥 Breaking News
        </h3>
        <span style={{
          fontSize: '11px',
          color: 'var(--lm-gray-500)',
          fontStyle: 'italic'
        }}>
          {isPaused ? 'Paused - Move mouse away to resume' : 'Auto-scrolling • Hover to pause'}
        </span>
      </div>
      
      <div 
        ref={scrollContainerRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '15px',
          paddingBottom: '8px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--lm-gray-300) transparent',
          scrollBehavior: 'auto',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Duplicate the stories for seamless infinite scroll */}
        {[...topStories, ...topStories].map((story, index) => (
          <div
            key={`${index}-${story.title}`}
            className="breaking-news__card"
            style={{
              minWidth: '280px',
              maxWidth: '280px',
              padding: '12px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 60, 92, 0.15)';
              e.currentTarget.style.borderLeftColor = 'var(--lm-primary-navy)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.06)';
              e.currentTarget.style.borderLeftColor = 'var(--lm-primary-yellow)';
            }}
            onClick={() => window.open(story.url, '_blank')}
          >
            {/* Source and Time */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span className="breaking-news__source">
                {story.source?.name || 'News'}
              </span>
              <span style={{
                fontSize: '11px',
                color: 'var(--lm-gray-500)'
              }}>
                {formatDate(story.publishedAt)}
              </span>
            </div>

            {/* Title */}
            <h4 style={{
              margin: '0',
              fontSize: '13px',
              fontWeight: '600',
              lineHeight: '1.3',
              color: 'var(--lm-primary-navy)',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: 1
            }}>
              {story.title}
            </h4>

            {/* Read more indicator */}
            <div style={{
              marginTop: '8px',
              fontSize: '11px',
              color: 'var(--lm-primary-yellow)',
              fontWeight: '600',
              textAlign: 'right'
            }}>
              →
            </div>
          </div>
        ))}
      </div>

      {/* Custom scrollbar styles */}
      <style>
        {`
          div::-webkit-scrollbar {
            height: 6px;
          }
          div::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }
          div::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 3px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: #999;
          }
        `}
      </style>
    </div>
  );
}
