const express = require('express');
const request = require('request');
// const fs = require('fs');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/content', (req, res) => {
  console.log("%%% content");
  const filename = encodeURIComponent(req.query.name) || "";
  const url = `http://localhost:3001/download?name=${filename}`;
  const options = {
      method: 'GET',
      url: url,
      headers: {
        'Accept': 'application/zip',
        'Accept-Charset': 'utf-8',
      },
      encoding: null,
      json: true
  };

  let responseStatus;
  const requests = request(options)
    .on('error', (err) => {
      console.error('error: ', err);
    })
    .on('data', (data) => {
      console.log("*** data === ", data);
    })
    .on('response', (response, body) => {
      console.log("**** response status: ", response.statusCode);
      console.log("**** response body: ", body);
      if (response.statusCode === 200) {
        responseStatus = 200;
        requests.pipe(res);
        // To save to the local file system
        // requests.pipe(fs.createWriteStream(filename + '.zip'));
      } else {
        responseStatus = 500;
        res.status(response.statusCode).send({ message: "Failed to downloaded" });
      }
    })
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
