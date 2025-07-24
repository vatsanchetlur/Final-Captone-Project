import { CustomModal } from './CustomModal';
import { useState } from 'react';

export function SavedQueries(params) {
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

  function onSavedQueryClick(savedQuery){
    params.onQuerySelect(savedQuery);
  }

  function onDeleteQueryClick(event, queryToDelete) {
    event.stopPropagation(); // Prevent triggering the query selection
    if (params.onDeleteQuery) {
      params.onDeleteQuery(queryToDelete);
    }
  }

  function onClearQueries() {
    if (params.onClearQueries) {
      showModal(
        'Clear All Saved Queries',
        `This will permanently remove all ${params.savedQueries.length} saved ${params.savedQueries.length === 1 ? 'query' : 'queries'} from your collection.\n\nThis action cannot be undone.\n\nAre you sure you want to continue?`,
        'error',
        () => {
          params.onClearQueries();
        },
        true
      );
    }
  }

  const formatQueryDetails = (query) => {
    const details = [];
    if (query.q && query.q.trim() !== '') details.push(`Search: "${query.q}"`);
    if (query.country && query.country.trim() !== '') details.push(`Country: ${query.country.toUpperCase()}`);
    if (query.category && query.category.trim() !== '') details.push(`Category: ${query.category.charAt(0).toUpperCase() + query.category.slice(1)}`);
    if (query.language && query.language.trim() !== '') details.push(`Language: ${query.language.toUpperCase()}`);
    // Remove pageSize display as requested: if (query.pageSize) details.push(`Size: ${query.pageSize}`);
    return details.join(' • ');
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const queryTime = new Date(timestamp);
    const diffMs = now - queryTime;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return queryTime.toLocaleDateString();
  };

  function getQueries() {
    return params.savedQueries.map((item, idx) => {
      const isSelected = item.queryName === params.selectedQueryName;
      
      return (
        <div 
          key={idx} 
          onClick={() => onSavedQueryClick(item)} 
          className={`query-item ${isSelected ? 'selected' : ''}`}
          style={{ position: 'relative' }}
        >
          <div className="query-content">
            <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: '1.4' }}>
              <span style={{ fontWeight: '600', color: '#262626' }}>Query #{idx + 1}:</span> {formatQueryDetails(item)}
            </p>
          </div>
          {params.onDeleteQuery && (
            <button 
              className="delete-query-btn"
              onClick={(e) => onDeleteQueryClick(e, item)}
              title="Delete this query"
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: '0.7',
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.7'}
            >
              ✕
            </button>
          )}
        </div>
      );
    });
  }

  return (
    <div className="saved-queries">
      {(params.savedQueries && params.savedQueries.length > 0) ? (
        <>
          {getQueries()}
          <button onClick={onClearQueries} className="clear-btn">
            🗑️ Clear All Queries
          </button>
        </>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem 1rem', 
          color: '#666',
          background: '#f8f9fa',
          borderRadius: '10px',
          border: '2px dashed #dee2e6'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            No Saved Queries Yet!
          </div>
          <div style={{ fontSize: '0.9rem' }}>
            Create your first query using the form to get started.
          </div>
        </div>
      )}
      {modal.isOpen && (
        <CustomModal 
          isOpen={modal.isOpen}
          title={modal.title}
          message={modal.message}
          type={modal.type}
          onConfirm={modal.onConfirm}
          onClose={closeModal}
          showCancel={modal.showCancel}
        />
      )}
    </div>
  );
}