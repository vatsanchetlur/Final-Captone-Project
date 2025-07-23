export function SavedQueries(params) {
  
  function onSavedQueryClick(savedQuery){
    params.onQuerySelect(savedQuery);
  }

  function onClearQueries() {
    if (params.onClearQueries) {
      if (window.confirm('Are you sure you want to clear all saved queries? This action cannot be undone.')) {
        params.onClearQueries();
      }
    }
  }

  const formatQueryDetails = (query) => {
    const details = [];
    if (query.q) details.push(`Search: "${query.q}"`);
    if (query.country) details.push(`Country: ${query.country.toUpperCase()}`);
    if (query.language) details.push(`Language: ${query.language.toUpperCase()}`);
    if (query.pageSize) details.push(`Size: ${query.pageSize}`);
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
        >
          <h4>Query #{idx + 1}</h4>
          <p>{formatQueryDetails(item)}</p>
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
    </div>
  );
}