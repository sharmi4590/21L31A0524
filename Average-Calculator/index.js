 
 /*const CREDENTIALS = {
    companyName: "goMart",
clientID: "d0a44841-c81f-4a7d-a5ed-f2c824861d74",
clientSecret: "fInYkAyMGWqKfFJS",
ownerName: "Rahul",
ownerEmail: "21l31a0524@vignaniit.edu.in",
rollNo: "21L31A0524"
};

let accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIxOTcxMTM1LCJpYXQiOjE3MjE5NzA4MzUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImQwYTQ0ODQxLWM4MWYtNGE3ZC1hNWVkLWYyYzgyNDg2MWQ3NCIsInN1YiI6IjIxbDMxYTA1MjRAdmlnbmFuaWl0LmVkdS5pbiJ9LCJjb21wYW55TmFtZSI6ImdvTWFydCIsImNsaWVudElEIjoiZDBhNDQ4NDEtYzgxZi00YTdkLWE1ZWQtZjJjODI0ODYxZDc0IiwiY2xpZW50U2VjcmV0IjoiZkluWWtBeU1HV3FLZkZKUyIsIm93bmVyTmFtZSI6IlJhaHVsIiwib3duZXJFbWFpbCI6IjIxbDMxYTA1MjRAdmlnbmFuaWl0LmVkdS5pbiIsInJvbGxObyI6IjIxTDMxQTA1MjQifQ.EGLZyqKSXtNkQid5VP9srgXrwmfXnnf9N74Ms7FE8Ls";*/
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const TIMEOUT = 50000; 
let STORAGE = [];

const CREDENTIALS = {
    companyName: "goMart",
clientID: "d0a44841-c81f-4a7d-a5ed-f2c824861d74",
clientSecret: "fInYkAyMGWqKfFJS",
ownerName: "Rahul",
ownerEmail: "21l31a0524@vignaniit.edu.in",
rollNo: "21L31A0524"
};

let accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIxOTcxMTM1LCJpYXQiOjE3MjE5NzA4MzUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImQwYTQ0ODQxLWM4MWYtNGE3ZC1hNWVkLWYyYzgyNDg2MWQ3NCIsInN1YiI6IjIxbDMxYTA1MjRAdmlnbmFuaWl0LmVkdS5pbiJ9LCJjb21wYW55TmFtZSI6ImdvTWFydCIsImNsaWVudElEIjoiZDBhNDQ4NDEtYzgxZi00YTdkLWE1ZWQtZjJjODI0ODYxZDc0IiwiY2xpZW50U2VjcmV0IjoiZkluWWtBeU1HV3FLZkZKUyIsIm93bmVyTmFtZSI6IlJhaHVsIiwib3duZXJFbWFpbCI6IjIxbDMxYTA1MjRAdmlnbmFuaWl0LmVkdS5pbiIsInJvbGxObyI6IjIxTDMxQTA1MjQifQ.EGLZyqKSXtNkQid5VP9srgXrwmfXnnf9N74Ms7FE8Ls";
const API_ENDPOINTS = {
    p: 'http://20.244.56.144/test/primes',
    f: 'http://20.244.56.144/test/fibo',
    e: 'http://20.244.56.144/test/even',
    r: 'http://20.244.56.144/test/rand'
};

const getAccessToken = async () => {
    try {
        const response = await axios.post('http://20.244.56.144/test/auth', {
            companyName: CREDENTIALS.companyName,
            clientID: CREDENTIALS.clientID,
            clientSecret: CREDENTIALS.clientSecret,
            ownerName: CREDENTIALS.ownerName,
            ownerEmail: CREDENTIALS.ownerEmail,
            rollNo: CREDENTIALS.rollNo
        });
        accessToken = response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error.message);
    }
};

const fetchNumbers = async (type) => {
    try {
        const response = await axios.get(API_ENDPOINTS[type], {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            timeout: TIMEOUT
        });
        return response.data.numbers;
    } catch (error) {
        console.error(`Error fetching ${type} numbers:`, error.message);
        return [];
    }
};

app.get('/numbers/:numberid', async (req, res) => {
    const numberid = req.params.numberid;
    if (!['p', 'f', 'e', 'r'].includes(numberid)) {
        return res.status(400).json({ error: 'Invalid number type' });
    }

    const start = Date.now();
    const newNumbers = await fetchNumbers(numberid);
    const end = Date.now();

    if (end - start > TIMEOUT) {
        return res.status(504).json({ error: 'Timeout exceeded while fetching numbers' });
    }
    const uniqueNewNumbers = [...new Set(newNumbers)];
    const windowPrevState = [...STORAGE];
    uniqueNewNumbers.forEach(number => {
        if (!STORAGE.includes(number)) {
            if (STORAGE.length >= WINDOW_SIZE) {
                STORAGE.shift(); 
            }
            STORAGE.push(number);
        }
    });

    const windowCurrState = [...STORAGE];
    const avg = (STORAGE.length === 0) ? 0 : STORAGE.reduce((a, b) => a + b, 0) / STORAGE.length;

    res.json({
        windowPrevState,
        windowCurrState,
        numbers: uniqueNewNumbers,
        avg: avg.toFixed(2)
    });
});

app.listen(PORT, async () => {
    await getAccessToken();
    console.log(`Server is running on http://localhost:${PORT}`);
});
