// scripts/build-blog-index.js
const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'blogs');
if (!fs.existsSync(BLOG_DIR)) {
  console.error('blogs directory not found:', BLOG_DIR);
  process.exit(1);
}

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.json') && f !== 'index.json');

const posts = files.map(f => {
  try {
    const raw = fs.readFileSync(path.join(BLOG_DIR, f), 'utf8');
    const data = JSON.parse(raw);
    return { file: f, date: data.date || '1970-01-01' };
  } catch (e) {
    return { file: f, date: '1970-01-01' };
  }
});

posts.sort((a, b) => new Date(b.date) - new Date(a.date));
const index = posts.map(p => p.file);

fs.writeFileSync(path.join(BLOG_DIR, 'index.json'), JSON.stringify(index, null, 2) + '\n');
console.log('Wrote', index.length, 'entries to blogs/index.json');
