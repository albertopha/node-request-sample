const express = require('express');
const request = require('request');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/contented', (req, res) => {
  console.log("%%% content");
  const filename = encodeURIComponent(req.query.name) || "";
  const url = `http://localhost:3001/download?name=${filename}`;
  const options = {
      method: 'GET',
      url: url,
      headers: {
        'Accept': 'application/zip',
        'Accept-Charset': 'utf-8',
      }
  };

  request(options)
    .on('error', (err) => {
      console.error('error: ', err);
    })
    .on('data', (data) => {
      console.log("*** data === ", data);
    })
    .on('response', (response, body) => {
      console.log("**** response status: ", response.statusCode);
      console.log("**** response body: ", body);
      if (response.statusCode !== 200) {
        res.status(response.statusCode).send({ message: "Failed to downloaded" });
      }
      // if (response.statusCode === 200) {
      //   res.status(200).send({ message: "Sucessfully downloaded" });
      // } else {
      //   res.status(response.statusCode).send({ message: "Failed to downloaded" });
      // }
    })
    .pipe(res)
    .on("finish", (response) => {
      console.log("**** finished: response === ", response);
      console.log("**** fininshed!!");
      res.status(200).send({ message: "Sucessfully downloaded" });
    });
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
