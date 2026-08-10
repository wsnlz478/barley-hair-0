const fs = require('fs');
const path = require('path');

const files = [
  'body-hair-transplant.html',
  'cases.html',
  'contact.html',
  'doctors.html',
  'faq.html',
  'female-hair-loss-guide.html',
  'finasteride.html',
  'hair-loss-treatment.html',
  'hair-transplant-results.html',
  'male-hair-loss-guide.html',
  'microneedle-hair-transplant.html',
  'services.html',
  'technology.html'
];

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let openCount = 0;
  let closeCount = 0;
  let stack = []; // stack of line numbers where divs were opened
  let mismatches = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Count opening divs on this line
    const openMatches = line.match(/<div[\s>]/g);
    const openNum = openMatches ? openMatches.length : 0;

    // Count closing divs on this line
    const closeMatches = line.match(/<\/div>/g);
    const closeNum = closeMatches ? closeMatches.length : 0;

    for (let j = 0; j < openNum; j++) {
      stack.push(lineNum);
      openCount++;
    }

    for (let j = 0; j < closeNum; j++) {
      if (stack.length > 0) {
        stack.pop();
      } else {
        mismatches.push({ line: lineNum, type: 'extra_close', content: line.trim() });
      }
      closeCount++;
    }
  }

  // Remaining stack items are unclosed divs
  const unclosedDivs = stack.map(lineNum => ({
    line: lineNum,
    type: 'unclosed',
    content: lines[lineNum - 1].trim()
  }));

  return {
    openCount,
    closeCount,
    mismatches,
    unclosedDivs,
    totalLines: lines.length
  };
}

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`\n${file}: FILE NOT FOUND`);
    continue;
  }
  const result = analyzeFile(filePath);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${file}: open=${result.openCount}, close=${result.closeCount}, diff=${result.openCount - result.closeCount}`);

  if (result.mismatches.length > 0) {
    console.log(`  Extra closing divs (no matching open):`);
    for (const m of result.mismatches) {
      console.log(`    Line ${m.line}: ${m.content.substring(0, 100)}`);
    }
  }

  if (result.unclosedDivs.length > 0) {
    console.log(`  Unclosed divs (missing close):`);
    for (const u of result.unclosedDivs) {
      console.log(`    Line ${u.line}: ${u.content.substring(0, 100)}`);
    }
  }

  if (result.mismatches.length === 0 && result.unclosedDivs.length === 0) {
    console.log(`  OK - all divs matched`);
  }
}
