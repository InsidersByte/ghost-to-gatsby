// @flow

import moment from 'moment';
import remark from 'remark';
import download from 'image-downloader';
import chalk from 'chalk';
import url from 'url';
import fs from 'fs';
import path from 'path';
import createPage from './create-page';
import extractImages from './extract-images';
import type { RootInterface } from './types';

type Post = {
  slug: string,
  date: moment,
  title: string,
  image: string,
  markdown: string,
  tags: string[],
  draft: boolean,
  featured: boolean,
};

type Posts = Post[];

const getImagePath = imageUrl => {
  const parsed = url.parse(imageUrl);
  return path.basename(parsed.pathname || '');
};

const createPages = async (filePath: string, outputDirectory: string) => {
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
    ({ title, slug, image, markdown, published_at, id, status, featured }) => {
      const postTags = data.posts_tags
        .filter(o => o.post_id === id)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(o => o.tag_id);

      const tags = data.tags
        .filter(o => postTags.includes(o.id))
        .map(o => o.name);

      return {
        slug,
        date: moment(published_at),
        title,
        image,
        markdown,
        tags,
        draft: status !== 'published',
        featured: featured === 1,
      };
    },
  );

  const pages = posts.map(post => createPage(post, outputDirectory));

  await Promise.all(pages);

  console.log(chalk.green('Done'));
};

export default createPages;
