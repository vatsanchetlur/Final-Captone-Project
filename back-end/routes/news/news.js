import express from "express";
import env from "../../config.js";


const router = express.Router();

const apiKey = env.APIKEY;
if(!apiKey){
  console.log("Please set the API_KEY environment variable with a valid newsapi.org apiKey and restart the server!");
  process.exit(0);
}
const baseUrl = 'https://newsapi.org/v2/top-headlines';

function addApiKey(queryObject){
    // Use 'everything' endpoint for search queries with 'q' parameter
    // Use 'top-headlines' for country/category based queries
    const hasSearchQuery = queryObject.q && queryObject.q.trim() !== '';
    const baseUrl = hasSearchQuery ? 
        'https://newsapi.org/v2/everything' : 
        'https://newsapi.org/v2/top-headlines';
    return {...queryObject, apiKey: apiKey, baseUrl: baseUrl}
}

export function createUrlFromQueryObject(queryObjectWithApiKey) {
    const baseUrl = queryObjectWithApiKey.baseUrl || 'https://newsapi.org/v2/top-headlines';
    
    // Define valid parameters for each endpoint
    const everythingParams = ['q', 'sources', 'domains', 'excludeDomains', 'from', 'to', 'language', 'sortBy', 'pageSize', 'page', 'apiKey'];
    const topHeadlinesParams = ['country', 'category', 'sources', 'q', 'pageSize', 'page', 'apiKey'];
    
    // Choose valid parameters based on endpoint
    const isEverythingEndpoint = baseUrl.includes('everything');
    const validParams = isEverythingEndpoint ? everythingParams : topHeadlinesParams;
    
    // Filter out invalid parameters
    const filteredParams = {};
    for (const [key, value] of Object.entries(queryObjectWithApiKey)) {
        if (validParams.includes(key) && value !== undefined && value !== null) {
            filteredParams[key] = value;
        }
    }
    
    const queryString = new URLSearchParams(filteredParams).toString();
    const url = baseUrl + "?" + queryString;
    console.log('Generated NewsAPI URL:', url);
    return url;
}


export async function fetchData(url) {
    let data = null;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

router.get('/', async (req, res) => {
    let fixedQueryObject = {
        "country": "us",
        "q": "news"
    }
    let queryObject = addApiKey(fixedQueryObject);
    let url = createUrlFromQueryObject(queryObject);
    let newsArticles = await fetchData(url);
    res.send(newsArticles);
});

router.post('/', async (req, res) => {
    let query = req.body;
    console.log('Received query from frontend:', query);
    let queryObjectWithApiKey = addApiKey(query);
    let url = createUrlFromQueryObject(queryObjectWithApiKey);
    let newsArticles = await fetchData(url);
    res.send(newsArticles);  
});

export default router;