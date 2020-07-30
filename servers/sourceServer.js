const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/download', (req, res) => {
  console.log("Source Server download!!!!!");
  console.log("** filename = ", req.query.name);
  const filename = req.query.name || "";
  const filePath = path.resolve(__dirname, "..", "static", filename);
  const stream = fs.createReadStream(filePath);

  console.log("*** filepath = ", filePath);

  // Handle non-existent file
  stream.on('error', function(error) {
    res.writeHead(404, 'Not Found');
    res.write('404: File Not Found!');
    res.end();
  });

  // File exists, stream it to user
  res.statusCode = 200;
  stream.pipe(res);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
