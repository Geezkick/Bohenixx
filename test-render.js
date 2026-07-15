// simple script to fetch the page HTML
const http = require('http');

http.get('http://localhost:3000/dashboard', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    if (data.includes('Something went wrong')) {
      console.log('Error found in HTML output');
    } else {
      console.log('HTML seems OK or redirects');
    }
    // Also let's print the next.js dev logs if we can
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});
