export function SavedQueries(params) {
  
  function onSavedQueryClick(savedQuery){
    params.onQuerySelect(savedQuery);
  }

  function onClearQueries() {
    if (params.onClearQueries) {
      params.onClearQueries();
    }
  }

  function onDeleteQuery(event, queryToDelete) {
    event.stopPropagation(); // Prevent triggering the query selection
    if (params.onDeleteQuery) {
      params.onDeleteQuery(queryToDelete);
    }
  }

  function getQueries() {
    return params.savedQueries.map((item, idx) => {
      const isSelected = item.queryName === params.selectedQueryName;
      const resultsCount = item.totalResults !== undefined ? item.totalResults : '?';
      
      return (
        <div 
          key={idx} 
          onClick={() => onSavedQueryClick(item)} 
          style={{
            marginBottom: '12px',
            padding: '16px',
            backgroundColor: isSelected ? '#fff' : '#fafafa',
            border: isSelected ? '2px solid var(--lm-primary-yellow)' : '1px solid #e5e5e5',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            boxShadow: isSelected ? '0 4px 12px rgba(255, 208, 0, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.borderColor = '#d0d0d0';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = '#fafafa';
              e.currentTarget.style.borderColor = '#e5e5e5';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {/* Header with title and actions */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <h4 style={{ 
              fontWeight: '600', 
              fontSize: '15px',
              color: isSelected ? 'var(--lm-primary-navy)' : '#333',
              margin: '0',
              flex: 1
            }}>
              {item.queryName}
            </h4>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Results badge */}
              <span style={{
                fontSize: '11px',
                color: '#666',
                backgroundColor: isSelected ? 'var(--lm-primary-yellow)' : '#e9ecef',
                padding: '4px 8px',
                borderRadius: '12px',
                fontWeight: '600',
                border: isSelected ? '1px solid #ffc107' : '1px solid #dee2e6'
              }}>
                {resultsCount.toLocaleString()} results
              </span>
              
              {/* Delete button */}
              {params.onDeleteQuery && (
                <button
                  onClick={(e) => onDeleteQuery(e, item)}
                  style={{
                    background: 'none',
                    border: '1px solid #dc3545',
                    color: '#dc3545',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '24px',
                    minHeight: '24px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#dc3545';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#dc3545';
                  }}
                  title="Delete this search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          {/* Search query preview */}
          <div style={{ 
            fontSize: '13px', 
            color: '#666',
            fontStyle: 'italic',
            backgroundColor: '#f8f9fa',
            padding: '6px 10px',
            borderRadius: '4px',
            border: '1px solid #e9ecef'
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
          <div style={{ marginBottom: '16px' }}>
            {getQueries()}
          </div>
          <button 
            onClick={onClearQueries}
            style={{
              width: '100%',
              fontSize: '13px',
              fontWeight: '500',
              color: '#dc3545',
              backgroundColor: 'transparent',
              border: '1px solid #dc3545',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#dc3545';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#dc3545';
            }}
          >
            🗑️ Clear All Searches
          </button>
        </>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: '#666',
          backgroundColor: '#fafafa',
          border: '2px dashed #ddd',
          borderRadius: '12px'
        }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '16px',
            opacity: '0.7'
          }}>
            🔍
          </div>
          <h3 style={{ 
            fontSize: '16px', 
            margin: '0 0 8px 0',
            fontWeight: '600',
            color: '#333'
          }}>
            No saved searches yet
          </h3>
          <p style={{ 
            fontSize: '14px', 
            margin: '0',
            color: '#888',
            lineHeight: '1.4'
          }}>
            Create and save your first search to see it here
          </p>
        </div>
      )}
    </div>
  );
}