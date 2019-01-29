const express = require('express');

const app = express(); 

app.get('/', (request, response) =>{
response.send('hello world');
});
app.get("/sida2",(request, response) =>{
    response.send('sida2')
});
app.listen(1111, () => console.log('application running on port 1111/sida2'));