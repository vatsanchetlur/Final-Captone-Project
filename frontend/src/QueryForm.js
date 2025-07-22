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
        <div>
            <form>
                <div>
                    <label htmlFor="queryName">Query Name: </label>
                    <input type="text" size={10} id="queryName" name="queryName" value={params.formObject.queryName} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="q">Query Text: </label>
                    <input type="text" size={10} id="q" name="q" value={params.formObject.q} onChange={handleChange} />
                </div>
                <div className={currentUserIsAdmin() ? "visible" : "hidden"}
                     style={{border: "solid black 1px"}}>
                    {/* Extra fields */}
                    <div>
                        <label htmlFor="language">Language: </label>
                        <select id="language" name="language" value={params.formObject.language} onChange={handleChange}>
                            <option value="">All</option>
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            {/* Add options for specific languages (e.g., en, es, fr) */}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="pageSize">Page Size: </label>
                        <input
                            type="number"
                            id="pageSize"
                            name="pageSize"
                            min={1}
                            max={100}
                            value={params.formObject.pageSize}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <span style={{ display: "block", backgroundColor: "#eee" }}>
                    <input type="button" value="Submit" onClick={onSubmitClick} />
                </span>                
            </form>
        </div>
    );

}