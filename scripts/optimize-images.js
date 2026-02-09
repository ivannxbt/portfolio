#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Image Optimization Script
 *
 * Converts PNG/JPEG images to WebP format with quality optimization.
 * Keeps originals as .original backups for safety.
 */

const projectImages = [
  { input: 'public/projects/caamano-inmuebles.png', quality: 80 },
  { input: 'public/projects/budget-analysis-agent.png', quality: 80 },
  { input: 'public/projects/data-deduplication.png', quality: 80 },
  { input: 'public/projects/enterprise-rag-chatbot.png', quality: 80 },
  { input: 'public/projects/ml-radar-optimizer.png', quality: 80 },
  { input: 'public/projects/pa-document-generator.png', quality: 80 },
  { input: 'public/projects/nexxo.png', quality: 80 },
];

const socialIcons = [
  { input: 'public/linkedin.png', quality: 85 },
  { input: 'public/cv_iacc.png', quality: 85 },
  { input: 'public/x.png', quality: 85 },
  { input: 'public/github.png', quality: 85 },
  { input: 'public/profile.jpeg', quality: 80 },
];

async function optimizeImage(config) {
  const { input, quality } = config;
  const inputPath = path.join(__dirname, '..', input);
  const ext = path.extname(inputPath);
  const baseName = path.basename(inputPath, ext);
  const dirName = path.dirname(inputPath);

  // Create .original backup
  const originalPath = path.join(dirName, `${baseName}${ext}.original`);
  const webpPath = path.join(dirName, `${baseName}.webp`);

  try {
    // Get original size
    const originalStats = fs.statSync(inputPath);
    const originalSizeKB = (originalStats.size / 1024).toFixed(2);

    // Create backup if it doesn't exist
    if (!fs.existsSync(originalPath)) {
      fs.copyFileSync(inputPath, originalPath);
      console.log(`✓ Backed up: ${input} -> ${baseName}${ext}.original`);
    }

    // Convert to WebP
    await sharp(inputPath)
      .webp({ quality })
      .toFile(webpPath);

    // Get new size
    const webpStats = fs.statSync(webpPath);
    const webpSizeKB = (webpStats.size / 1024).toFixed(2);
    const savings = (((originalStats.size - webpStats.size) / originalStats.size) * 100).toFixed(1);

    console.log(`✓ Optimized: ${input}`);
    console.log(`  Original: ${originalSizeKB} KB -> WebP: ${webpSizeKB} KB (${savings}% savings)`);

    return {
      file: input,
      originalSize: originalStats.size,
      webpSize: webpStats.size,
      savings: parseFloat(savings)
    };
  } catch (error) {
    console.error(`✗ Failed to optimize ${input}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');
  console.log('=== PROJECT IMAGES ===\n');

  const projectResults = [];
  for (const config of projectImages) {
    const result = await optimizeImage(config);
    if (result) projectResults.push(result);
  }

  console.log('\n=== SOCIAL ICONS ===\n');

  const socialResults = [];
  for (const config of socialIcons) {
    const result = await optimizeImage(config);
    if (result) socialResults.push(result);
  }

  // Summary
  console.log('\n=== SUMMARY ===\n');

  const allResults = [...projectResults, ...socialResults];
  const totalOriginal = allResults.reduce((sum, r) => sum + r.originalSize, 0);
  const totalWebP = allResults.reduce((sum, r) => sum + r.webpSize, 0);
  const totalSavings = ((totalOriginal - totalWebP) / totalOriginal * 100).toFixed(1);

  console.log(`Project Images: ${(projectResults.reduce((s, r) => s + r.originalSize, 0) / 1024 / 1024).toFixed(2)} MB -> ${(projectResults.reduce((s, r) => s + r.webpSize, 0) / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Social Icons: ${(socialResults.reduce((s, r) => s + r.originalSize, 0) / 1024 / 1024).toFixed(2)} MB -> ${(socialResults.reduce((s, r) => s + r.webpSize, 0) / 1024 / 1024).toFixed(2)} MB`);
  console.log(`\nTotal: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB -> ${(totalWebP / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Savings: ${((totalOriginal - totalWebP) / 1024 / 1024).toFixed(2)} MB (${totalSavings}%)`);

  console.log('\n✓ Optimization complete!');
  console.log('\nNext steps:');
  console.log('1. Update component imports to use .webp extensions');
  console.log('2. Test that images render correctly');
  console.log('3. If satisfied, you can delete .original files');
}

main().catch(console.error);
