
const fs = require('fs');

const readingPlanContent = fs.readFileSync('g:/ANO BIBLICO/lib/reading-plan.ts', 'utf8');
const bibleBooksContent = fs.readFileSync('g:/ANO BIBLICO/lib/bible-books.ts', 'utf8');

const allBooksRegex = /bookId:\s*"([^"]+)"/g;
const readingPlanIds = [];
let match;
while ((match = allBooksRegex.exec(readingPlanContent)) !== null) {
    readingPlanIds.push(match[1]);
}

const bibleBooksRegex = /id:\s*"([^"]+)"/g;
const bibleBookIds = [];
while ((match = bibleBooksRegex.exec(bibleBooksContent)) !== null) {
    bibleBookIds.push(match[1]);
}

console.log("IDs in reading-plan.ts:", readingPlanIds.length);
console.log("IDs in bible-books.ts:", bibleBookIds.length);

const onlyInReadingPlan = readingPlanIds.filter(id => !bibleBookIds.includes(id));
const onlyInBibleBooks = bibleBookIds.filter(id => !readingPlanIds.includes(id));

console.log("Only in reading-plan.ts:", onlyInReadingPlan);
console.log("Only in bible-books.ts:", onlyInBibleBooks);
