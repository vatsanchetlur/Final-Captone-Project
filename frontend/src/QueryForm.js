export function QueryForm(params) {
    const handleChange = (event) => {
        let newQueryObject = { ...params.formObject };
        newQueryObject[event.target.name] = event.target.value;
        params.setFormObject(newQueryObject);
    };

    function onSubmitClick(event) {
        event.preventDefault();
        if (!params.formObject.queryName) {
            alert("please provide a name for the query!");
            return;
        }
        if (!params.formObject.q || params.formObject.q.length === 0) {
            alert("please provide some text for the query field!");
            return;
        }
        params.submitToParent(params.formObject);
    };

    function currentUserIsAdmin(){
        if(params.currentUser){
            if(params.currentUser.user){
                if(params.currentUser.user === "admin"){
                    return true;
                }
            }
        }
        return false;
    }

    return (
        <div className="lm-card">
            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Basic Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label htmlFor="queryName" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                            Query Name
                        </label>
                        <input 
                            type="text" 
                            id="queryName" 
                            name="queryName" 
                            value={params.formObject.queryName || ''} 
                            onChange={handleChange}
                            placeholder="Enter query name..."
                            className="lm-input"
                        />
                    </div>
                    <div>
                        <label htmlFor="q" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                            Search Terms
                        </label>
                        <input 
                            type="text" 
                            id="q" 
                            name="q" 
                            value={params.formObject.q || ''} 
                            onChange={handleChange}
                            placeholder="What are you looking for?"
                            className="lm-input"
                        />
                    </div>
                </div>

                {/* Advanced Options (Admin Only) */}
                <div style={{ display: currentUserIsAdmin() ? 'block' : 'none' }}>
                    <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '16px', marginTop: '16px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>Advanced Options</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label htmlFor="language" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                                    Language
                                </label>
                                <select 
                                    id="language" 
                                    name="language" 
                                    value={params.formObject.language || ''} 
                                    onChange={handleChange}
                                    className="lm-select"
                                >
                                    <option value="">All Languages</option>
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="pageSize" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                                    Articles Count
                                </label>
                                <input
                                    type="number"
                                    id="pageSize"
                                    name="pageSize"
                                    min={1}
                                    max={100}
                                    value={params.formObject.pageSize || ''}
                                    onChange={handleChange}
                                    placeholder="20"
                                    className="lm-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div style={{ paddingTop: '16px' }}>
                    <button 
                        type="button" 
                        onClick={onSubmitClick}
                        className="lm-button lm-button--primary"
                        style={{ width: '100%' }}
                    >
                        Search News
                    </button>
                </div>
            </form>
        </div>
    );
}