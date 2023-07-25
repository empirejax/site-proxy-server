const express = require('express');
const cors = require('cors');
const request = require('request');

const app = express();

app.use(cors());

app.get('/proxy', (req, res) => {
  // This is the URL of the resource you are trying to access
  const url = req.query.url;

  // Set up the request options
  const options = {
    url: url,
    headers: {
      'User-Agent': 'request',
    },
    encoding: null, // This ensures that the body is returned as a Buffer
  };

  request(options, (error, response, body) => {
    if (error) {
      return res.status(500).json({type: 'error', message: error.message});
    }
    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({type: 'error', message: 'Unexpected status code: ' + response.statusCode});
    }

    // Set the correct content type
    res.set('Content-Type', response.headers['content-type']);

    // Check if the response is JSON
    if (response.headers['content-type'] === 'application/json') {
      // If it's JSON, parse it and send it as JSON
      res.json(JSON.parse(body));
    } else {
      // If it's not JSON, send it as is
      res.send(body);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
