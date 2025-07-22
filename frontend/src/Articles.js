export function Articles(params) {
    let articles = (params.data.articles)?params.data.articles:[];
    let queryName = (params.query.queryName)?params.query.queryName:"na";
    let articleCount = (params.data.totalResults)?params.data.totalResults:0;
    return (
      <div>
        Query: {queryName}
        <br/>Count: {articleCount}
        <ol >{
            articles.map((item, idx) => {
              if(item){
                if(item.title){
                  if(item.title === "[Removed]"){
                    return (<li key={idx} >Was Removed</li>);
                  }
                  let trimTitle = item.title.substring(0,30);
                  return (<li key={idx}>{trimTitle}<a href={item.url} target="_blank" rel="noreferrer" >&nbsp;Link</a></li>);    
                }else{
                  return (<li key={idx}>No Title</li>);
                }
              }else{
                return (<li key={1} >No Item</li>);
              }
            })
        }</ol>
      </div>
    )
  
  }