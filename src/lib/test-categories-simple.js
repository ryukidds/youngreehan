const fs = require('fs');
const TOKEN_FILE_PATH = '/Users/ryukidds/Desktop/영리한 웹사이트/cafe24-tokens.json';

async function run() {
  const tokens = JSON.parse(fs.readFileSync(TOKEN_FILE_PATH, 'utf8'));
  const accessToken = tokens.accessToken;
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'X-Cafe24-Api-Version': '2026-03-01'
  };
  const categoriesRes = await fetch('https://hypq.cafe24api.com/api/v2/admin/categories', { headers });
  const categoriesData = await categoriesRes.json();
  if (categoriesData.categories) {
    categoriesData.categories.forEach(c => {
      console.log(`${c.category_no}: ${c.category_name} (depth: ${c.category_depth})`);
    });
  }
}
run();
