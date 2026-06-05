const http = require('http');
const url = 'http://localhost:5000/api/sections/nosotros';
http.get(url, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    console.log(body);
  });
}).on('error', (err) => {
  console.error('ERROR', err.message);
});
