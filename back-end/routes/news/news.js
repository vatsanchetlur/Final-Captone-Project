import express from "express";
import env from "../../config.js";


const router = express.Router();

const apiKey = env.APIKEY;
if(!apiKey){
  console.log("Please set the API_KEY environment variable with a valid newsapi.org apiKey and restart the server!");
  process.exit(0);
}
const baseUrl = 'https://newsapi.org/v2/top-headlines';

function filterValidNewsApiParams(queryObject) {
    // Only include parameters that are valid for NewsAPI top-headlines endpoint
    const validParams = {};
    
    // Basic search parameters
    if (queryObject.q) validParams.q = queryObject.q;
    if (queryObject.country) validParams.country = queryObject.country;
    if (queryObject.category) validParams.category = queryObject.category;
    if (queryObject.sources) validParams.sources = queryObject.sources;
    
    // Advanced parameters
    if (queryObject.pageSize && queryObject.pageSize <= 100) {
        validParams.pageSize = queryObject.pageSize;
    }
    if (queryObject.page) validParams.page = queryObject.page;
    
    // Language parameter is NOT supported with keyword searches (q parameter) in top-headlines
    // Only include language if we're NOT doing a keyword search
    if (queryObject.language && !queryObject.q) {
        validParams.language = queryObject.language;
    }
    
    if (queryObject.sortBy) validParams.sortBy = queryObject.sortBy;
    
    console.log('Original parameters:', queryObject);
    console.log('Filtered parameters for NewsAPI:', validParams);
    return validParams;
}

function addApiKey(queryObject){
    const baseUrl = 'https://newsapi.org/v2/top-headlines';
    return {...queryObject, apiKey: apiKey}
}

export function createUrlFromQueryObject(queryObjectWithApiKey) {
    const queryString = new URLSearchParams(queryObjectWithApiKey).toString();
    const url = baseUrl + "?" + queryString;
    return url;
}


export async function fetchData(url) {
    let data = null;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 429) {
                throw new Error(`Rate limit exceeded. Please wait before making more requests. Status: ${response.status}`);
            } else if (response.status === 401) {
                throw new Error(`Invalid API key. Please check your NewsAPI key. Status: ${response.status}`);
            } else if (response.status === 426) {
                throw new Error(`Upgrade required. This endpoint requires a paid plan. Status: ${response.status}`);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
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
    try {
        console.log('Received query from frontend:', req.body);
        let query = req.body;
        let filteredQuery = filterValidNewsApiParams(query);
        let queryObjectWithApiKey = addApiKey(filteredQuery);
        let url = createUrlFromQueryObject(queryObjectWithApiKey);
        console.log('Final URL for NewsAPI:', url);
        let newsArticles = await fetchData(url);
        
        if (newsArticles === null) {
            // Return a friendly error response
            return res.status(503).json({
                status: 'error',
                message: 'Unable to fetch news at this time. This could be due to rate limiting or API issues. Please try again later.',
                articles: [],
                totalResults: 0
            });
        }
        
        res.send(newsArticles);
    } catch (error) {
        console.error('Error in POST /news:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while fetching news',
            articles: [],
            totalResults: 0
        });
    }
});

export default router;