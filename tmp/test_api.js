
const https = require('https');

const url = 'https://bolls.life/get-chapter/ARC/1/1/'; // Genesis 1

https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Data length:', json.length);
      if (json.length > 0) {
        console.log('First verse:', json[0].text);
      }
    } catch (e) {
      console.log('Error parsing JSON:', e.message);
      console.log('Raw data (first 100 chars):', data.substring(0, 100));
    }
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});
