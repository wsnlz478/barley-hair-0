const fs = require('fs');
const path = require('path');

// Files to process with their expected section counts
const filesToProcess = [
  { name: 'about.html', sections: 14 },
  { name: 'baldness-transplant.html', sections: 14 },
  { name: 'beard-transplant.html', sections: 15 },
  { name: 'beard-transplant-results.html', sections: 7 },
  { name: 'before-after-eyebrow-transplant.html', sections: 7 },
  { name: 'body-hair-transplant.html', sections: 14 },
  { name: 'cases.html', sections: 10 },
  { name: 'contact.html', sections: 9 },
  { name: 'doctors.html', sections: 10 },
  { name: 'does-daily-hair-loss-lead-to-balding.html', sections: 11 },
  { name: 'eyebrow-transplant.html', sections: 15 },
  { name: 'fue-hair-transplant.html', sections: 14 },
  { name: 'fue.html', sections: 8 },
  { name: 'fut-hair-transplant.html', sections: 14 },
  { name: 'fut.html', sections: 8 },
  { name: 'hair-care.html', sections: 13 },
  { name: 'hair-loss-calculator.html', sections: 10 },
  { name: 'hair-loss.html', sections: 1 },
  { name: 'hair-thickening.html', sections: 15 },
  { name: 'hair-transplant-cost.html', sections: 16 },
  { name: 'hair-transplant-in-beijing.html', sections: 10 },
  { name: 'hair-transplant-in-changsha.html', sections: 10 },
  { name: 'hair-transplant-in-chengdu.html', sections: 10 },
  { name: 'hair-transplant-in-china.html', sections: 10 },
  { name: 'hair-transplant-in-chongqing.html', sections: 10 },
  { name: 'hair-transplant-in-dalian.html', sections: 10 },
  { name: 'hair-transplant-in-fuzhou.html', sections: 8 },
  { name: 'hair-transplant-in-guangzhou.html', sections: 10 },
  { name: 'hair-transplant-in-guiyang.html', sections: 8 },
  { name: 'hair-transplant-in-hangzhou.html', sections: 10 },
  { name: 'hair-transplant-in-harbin.html', sections: 10 },
  { name: 'hair-transplant-in-hong-kong.html', sections: 7 },
  { name: 'hair-transplant-in-jinan.html', sections: 10 },
  { name: 'hair-transplant-in-kunming.html', sections: 9 },
  { name: 'hair-transplant-in-nanjing.html', sections: 10 },
  { name: 'hair-transplant-in-nanning.html', sections: 8 },
  { name: 'hair-transplant-in-nantong.html', sections: 10 },
  { name: 'hair-transplant-in-ningbo.html', sections: 10 },
  { name: 'hair-transplant-in-qingdao.html', sections: 10 },
  { name: 'hair-transplant-in-shanghai.html', sections: 10 },
  { name: 'hair-transplant-in-shenyang.html', sections: 10 },
  { name: 'hair-transplant-in-shenzhen.html', sections: 10 },
  { name: 'hair-transplant-in-suzhou.html', sections: 10 },
  { name: 'hair-transplant-in-taiwan.html', sections: 7 },
  { name: 'hair-transplant-in-taiyuan.html', sections: 8 },
  { name: 'hair-transplant-in-tianjin.html', sections: 10 },
  { name: 'hair-transplant-in-turkey.html', sections: 7 },
  { name: 'hair-transplant-in-wuhan.html', sections: 10 },
  { name: 'hair-transplant-in-xian.html', sections: 10 },
  { name: 'hair-transplant-in-zhengzhou.html', sections: 10 },
  { name: 'hair-transplant-process.html', sections: 14 },
  { name: 'hairline-transplant.html', sections: 15 },
  { name: 'index.html', sections: 12 },
  { name: 'index_original_backup.html', sections: 12 },
  { name: 'is-hair-loss-genetic.html', sections: 9 },
  { name: 'microneedle-technology.html', sections: 7 },
  { name: 'no-shave-hair-transplant.html', sections: 14 },
  { name: 'privacy-policy.html', sections: 3 },
  { name: 'reviews.html', sections: 8 },
  { name: 'scar-hair-transplant.html', sections: 13 },
  { name: 'services.html', sections: 9 },
  { name: 'sideburns-transplant.html', sections: 15 },
  { name: 'technology.html', sections: 12 }
];

// Function to determine section name based on content
function getSectionName(sectionHtml, nextSections, index) {
  // Check for class names
  if (sectionHtml.includes('class="hero"')) return 'Hero Section';
  if (sectionHtml.includes('class="contact"')) return 'Contact Section';
  if (sectionHtml.includes('class="testimonials"')) return 'Testimonials Section';
  if (sectionHtml.includes('class="technology"')) return 'Technology Section';
  if (sectionHtml.includes('class="services"')) return 'Services Section';
  if (sectionHtml.includes('class="about"')) return 'About Section';
  if (sectionHtml.includes('class="values"')) return 'Values Section';
  if (sectionHtml.includes('class="commitments"')) return 'Commitments Section';
  if (sectionHtml.includes('class="promises-section"')) return 'Promises Section';
  if (sectionHtml.includes('class="patents-section"')) return 'Patents Section';
  if (sectionHtml.includes('class="why-choose-section"')) return 'Why Choose Us Section';
  if (sectionHtml.includes('class="service-detail-section"')) return 'Service Detail Section';
  
  // Check for ID
  if (sectionHtml.includes('id="faq"')) return 'FAQ Section';
  if (sectionHtml.includes('id="contact"')) return 'Contact Section';
  
  // Check for h2 content
  const h2Match = sectionHtml.match(/<h2[^>]*>([^<]+)<\/h2>/);
  if (h2Match) {
    const h2Text = h2Match[1].trim();
    
    // Map common h2 texts to section names
    if (h2Text.includes('What Is') || h2Text.includes('Understanding')) return 'Introduction Section';
    if (h2Text.includes('Candidate')) return 'Candidate Assessment Section';
    if (h2Text.includes('Graft')) return 'Graft Requirements Section';
    if (h2Text.includes('Strategic Approach') || h2Text.includes('Our Approach')) return 'Approach Section';
    if (h2Text.includes('Why Choose')) return 'Why Choose Us Section';
    if (h2Text.includes('Benefits')) return 'Benefits Section';
    if (h2Text.includes('Process') || h2Text.includes('Journey')) return 'Process Section';
    if (h2Text.includes('Technique') || h2Text.includes('Technology')) return 'Technology Section';
    if (h2Text.includes('Results') || h2Text.includes('Before') || h2Text.includes('After')) return 'Results Section';
    if (h2Text.includes('Patients')) return 'Happy Patients Section';
    if (h2Text.includes('Testimonials') || h2Text.includes('What Our Patients Say')) return 'Testimonials Section';
    if (h2Text.includes('Clinic Environment') || h2Text.includes('Facilities')) return 'Clinic Environment Section';
    if (h2Text.includes('FAQ') || h2Text.includes('Frequently Asked')) return 'FAQ Section';
    if (h2Text.includes('Contact')) return 'Contact Section';
    if (h2Text.includes('Cost') || h2Text.includes('Price')) return 'Pricing Section';
    if (h2Text.includes('Recovery')) return 'Recovery Section';
    if (h2Text.includes('Comparison')) return 'Comparison Section';
    if (h2Text.includes('Styles')) return 'Styles Section';
    if (h2Text.includes('Calculator')) return 'Calculator Section';
    if (h2Text.includes('Guide')) return 'Guide Section';
    if (h2Text.includes('Causes')) return 'Causes Section';
    if (h2Text.includes('Treatment')) return 'Treatment Section';
    if (h2Text.includes('Prevention')) return 'Prevention Section';
    if (h2Text.includes('Locations') || h2Text.includes('Cities')) return 'Locations Section';
    if (h2Text.includes('Doctors') || h2Text.includes('Team')) return 'Doctors Section';
    if (h2Text.includes('Gallery') || h2Text.includes('Cases')) return 'Gallery Section';
  }
  
  // Default section names based on position
  if (index === 0) return 'Hero Section';
  if (index === 1) return 'Introduction Section';
  
  return `Content Section ${index + 1}`;
}

// Function to check if section already has a comment
function hasSectionComment(content, sectionIndex) {
  const lines = content.split('\n');
  let sectionCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if this line has a section comment
    if (line.match(/<!--\s*=+\s*.+\s*=+\s*-->/)) {
      // Check if next non-empty line is a section tag
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j].trim();
        if (nextLine === '') continue;
        if (nextLine.startsWith('<section')) {
          return true; // This section already has a comment
        }
        break;
      }
    }
    
    if (line.startsWith('<section')) {
      if (sectionCount === sectionIndex) {
        return false; // This section doesn't have a comment
      }
      sectionCount++;
    }
  }
  
  return false;
}

// Function to add section comments to a file
function addSectionComments(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const newLines = [];
    let sectionIndex = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Check if this is a section tag
      if (trimmedLine.startsWith('<section')) {
        // Check if previous non-empty line already has a section comment
        let hasComment = false;
        for (let j = newLines.length - 1; j >= 0; j--) {
          const prevLine = newLines[j].trim();
          if (prevLine === '') continue;
          if (prevLine.match(/<!--\s*=+\s*.+\s*=+\s*-->/)) {
            hasComment = true;
          }
          break;
        }
        
        if (!hasComment) {
          // Extract section HTML (current line and next few lines for context)
          let sectionHtml = line;
          for (let k = i + 1; k < Math.min(i + 10, lines.length); k++) {
            sectionHtml += lines[k];
          }
          
          // Determine section name
          const sectionName = getSectionName(sectionHtml, [], sectionIndex);
          
          // Add comment with proper indentation
          const indent = line.match(/^(\s*)/)[1];
          newLines.push(`${indent}<!-- ============ ${sectionName} ============ -->`);
        }
        
        sectionIndex++;
      }
      
      newLines.push(line);
    }
    
    // Write back to file
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
    console.log(`✓ Processed: ${path.basename(filePath)} (${sectionIndex} sections)`);
    return sectionIndex;
  } catch (error) {
    console.error(`✗ Error processing ${path.basename(filePath)}: ${error.message}`);
    return 0;
  }
}

// Main execution
console.log('Starting to add section comments to HTML files...\n');

let totalFiles = 0;
let totalSections = 0;

filesToProcess.forEach(fileInfo => {
  const filePath = path.join(__dirname, fileInfo.name);
  
  if (fs.existsSync(filePath)) {
    const sectionCount = addSectionComments(filePath);
    totalFiles++;
    totalSections += sectionCount;
  } else {
    console.log(`⚠ File not found: ${fileInfo.name}`);
  }
});

console.log(`\n${'='.repeat(60)}`);
console.log(`Summary:`);
console.log(`  Files processed: ${totalFiles}`);
console.log(`  Total sections: ${totalSections}`);
console.log(`${'='.repeat(60)}`);
