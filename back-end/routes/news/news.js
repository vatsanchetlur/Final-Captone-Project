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
    // Remove baseUrl from query parameters
    const {baseUrl: _, ...queryParams} = queryObjectWithApiKey;
    const queryString = new URLSearchParams(queryParams).toString();
    const url = baseUrl + "?" + queryString;
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
    let queryObjectWithApiKey = addApiKey(query);
    let url = createUrlFromQueryObject(queryObjectWithApiKey);
    let newsArticles = await fetchData(url);
    res.send(newsArticles);  
});

export default router;