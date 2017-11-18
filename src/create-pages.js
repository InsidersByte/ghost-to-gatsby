// @flow

import moment from 'moment';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import type { RootInterface } from './types';

type Post = {
  path: string,
  date: moment,
  title: string,
  markdown: string,
  tags: string[],
};

type Posts = Post[];

const createPages = (filePath: string, outputDirectory: string) => {
  console.log(chalk.green(`reading file '${filePath}'`));
  const contents = fs.readFileSync(filePath, 'utf8');

  console.log(chalk.green('parsing...'));
  const root: RootInterface = JSON.parse(contents);

  const dbs = root.db;

  if (dbs.length !== 1) {
    throw new Error('Only 1 db is supported');
  }

  const db = dbs[0];
  const { data } = db;

  console.log(chalk.green(`${data.posts.length} posts found`));

  const posts: Posts = data.posts.map(
    ({ title, slug, markdown, published_at, id }) => {
      const postTags = data.posts_tags
        .filter(o => o.post_id === id)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(o => o.tag_id);

      const tags = data.tags
        .filter(o => postTags.includes(o.id))
        .map(o => o.name);

      return {
        path: `/${slug}`,
        date: moment(published_at),
        title,
        markdown,
        tags,
      };
    },
  );

  posts.forEach(({ date, path: postPath, title, tags, markdown }: Post) => {
    const folderName = `${date.format('YYYY-MM-DD')}-${title}`
      .toLowerCase()
      .replace(/ /g, '-');

    const basePath = path.join(outputDirectory, folderName);
    const markdownPath = path.join(basePath, 'index.md');

    console.log(chalk.green(`Processing ${folderName}`));

    fs.mkdirSync(basePath);
    fs.writeFileSync(
      markdownPath,
      `---
path: "${postPath}"
date: "${date.toISOString()}"
title: "${title}"
tags: ${JSON.stringify(tags)}
---

${markdown}
  `,
    );
  });

  console.log(chalk.green('Done'));
};

export default createPages;
