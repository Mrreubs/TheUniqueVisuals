import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join, parse, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const srcDir = join(__dirname, 'images');
const outDir = join(__dirname, 'public', 'images');

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

const files = readdirSync(srcDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

const IMAGE_QUALITY = 60;
const MAX_WIDTH = 1400;

const categoryMap = {
  wedding: ['couple', 'groom', 'bride', 'after-party', 'group', '_MG_'],
  portrait: ['men', 'girls', 'IMG_'],
  fashion: ['bride-core', 'couple-core'],
  event: ['after-party', 'group-2'],
};

async function optimize() {
  const results = [];

  for (const file of files) {
    const inputPath = join(srcDir, file);
    const parsed = parse(file);
    const outputName = parsed.name.toLowerCase().replace(/[^a-z0-9_-]/g, '') + '.webp';
    const outputPath = join(outDir, outputName);

    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      let pipeline = image;
      if (metadata.width > MAX_WIDTH) {
        pipeline = pipeline.resize(MAX_WIDTH);
      }

      await pipeline
        .webp({ quality: IMAGE_QUALITY })
        .toFile(outputPath);

      const outMeta = await sharp(outputPath).metadata();
      const inputSize = (await sharp(inputPath).metadata()).size || 0;
      results.push({ file, outputName, inputSize, outputSize: outMeta.size, width: outMeta.width, height: outMeta.height });
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  }

  const totalInput = results.reduce((s, r) => s + r.inputSize, 0);
  const totalOutput = results.reduce((s, r) => s + r.outputSize, 0);

  console.log(`\nProcessed ${results.length} images`);
  console.log(`Input size: ${(totalInput / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Output size: ${(totalOutput / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Saved: ${((1 - totalOutput / totalInput) * 100).toFixed(1)}%`);

  const imageList = results.map(r => r.outputName).sort();
  writeFileSync(join(outDir, '_image-list.json'), JSON.stringify(imageList, null, 2));
  console.log(`\nImage list written to public/images/_image-list.json`);
}

optimize().catch(console.error);
