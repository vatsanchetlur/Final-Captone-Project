export function SavedQueries(params) {
  
  function onSavedQueryClick(savedQuery){
    params.onQuerySelect(savedQuery);
  }

  function onClearQueries() {
    if (params.onClearQueries) {
      params.onClearQueries();
    }
  }

  function getQueries() {
    return params.savedQueries.map((item, idx) => {
      const isSelected = item.queryName === params.selectedQueryName;
      const resultsCount = item.totalResults !== undefined ? item.totalResults : '?';
      
      return (
        <div 
          key={idx} 
          className="lm-card lm-card--clickable"
          onClick={() => onSavedQueryClick(item)} 
          style={{
            marginBottom: '8px',
            backgroundColor: isSelected ? '#f0f8ff' : undefined,
            borderColor: isSelected ? '#0066cc' : undefined
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '4px'
          }}>
            <div style={{ 
              fontWeight: '500', 
              fontSize: '14px',
              color: isSelected ? '#0066cc' : '#333'
            }}>
              {item.queryName}
            </div>
            <div style={{
              fontSize: '11px',
              color: '#888',
              backgroundColor: isSelected ? '#e6f3ff' : '#f0f0f0',
              padding: '2px 6px',
              borderRadius: '10px',
              fontWeight: '500'
            }}>
              {resultsCount} results
            </div>
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#666',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            "{item.q}"
          </div>
        </div>
      );
    });
  } 

  return (
    <div>
      {params.savedQueries && params.savedQueries.length > 0 ? (
        <>
          <div style={{ marginBottom: '15px' }}>
            {getQueries()}
          </div>
                    <button 
            className="lm-button lm-button--secondary"
            onClick={onClearQueries}
            style={{
              width: '100%',
              fontSize: '13px',
              color: '#dc3545'
            }}
          >
            Clear All Searches
          </button>
        </>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '30px 15px',
          color: '#666',
          backgroundColor: '#f9f9f9',
          border: '1px dashed #ddd',
          borderRadius: '6px'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔍</div>
          <p style={{ fontSize: '14px', margin: '0 0 4px 0' }}>No saved searches yet!</p>
          <p style={{ fontSize: '12px', margin: '0', color: '#888' }}>
            Create a search to save it here
          </p>
        </div>
      )}
    </div>
  );
}