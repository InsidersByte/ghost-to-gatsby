import remark from 'remark';
import download from 'image-downloader';
import chalk from 'chalk';
import url from 'url';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import extractImages from './extract-images';

const mkdirAsync = promisify(fs.mkdir);
const writeFileAsync = promisify(fs.writeFile);

const getImagePath = imageUrl => {
  const parsed = url.parse(imageUrl);
  return path.basename(parsed.pathname || '');
};

const createPage = async (
  { date, slug, title, tags, image, markdown: rawMarkdown, draft, featured },
  outputDirectory,
) => {
  const folderName = `${date.format('YYYY-MM-DD')}---${slug}`
    .toLowerCase()
    .replace(/ /g, '-');

  const basePath = path.join(outputDirectory, folderName);
  const imagesPath = path.join(basePath, 'images');
  const markdownPath = path.join(basePath, 'index.md');
  let markdown = rawMarkdown;
  let postImagePath;

  const ast = remark().parse(markdown);
  const images = extractImages(ast);

  console.log(chalk.green(`Processing '${folderName}'`));

  try {
    await mkdirAsync(basePath);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }

  const uniqueImages = [
    ...new Set(images.map(o => o.url).concat(image ? [image] : [])),
  ];

  if (uniqueImages.length > 0) {
    try {
      await mkdirAsync(imagesPath);
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }
  }

  const imagesWithPaths = uniqueImages.map(o => ({
    url: o,
    path: getImagePath(o),
  }));

  const downloads = imagesWithPaths.map(
    ({ url: imageUrl, path: originalImagePath }, index) => {
      let imagePath = originalImagePath;

      const occurrences = imagesWithPaths
        .slice(0, index)
        .reduce((count, value) => count + (value.path === imagePath), 0);

      if (occurrences >= 1) {
        const extension = path.extname(imagePath);
        const filename = path.basename(imagePath, extension);
        imagePath = `${filename}-${occurrences}${extension}`;
      }

      if (image === imageUrl) {
        postImagePath = imagePath;
      }

      markdown = markdown.replace(
        new RegExp(imageUrl, 'g'),
        `./images/${imagePath}`,
      );

      console.log(chalk.green(`Downloading '${imageUrl}'`));

      return download.image({
        url: imageUrl,
        dest: path.join(imagesPath, imagePath),
      });
    },
  );

  await Promise.all(downloads);

  await writeFileAsync(
    markdownPath,
    `---
title: "${title}"
slug: "/${slug}"
date: "${date.toISOString()}"${
      postImagePath
        ? `
image: "./images/${postImagePath}"`
        : ''
    }
featured: ${featured.toString()}
draft: ${draft.toString()}
tags: ${JSON.stringify(tags)}
---

${markdown}
`,
  );
};

export default createPage;
