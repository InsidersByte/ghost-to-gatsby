// @flow

import moment from 'moment';
import fs from 'fs';
import path from 'path';
import json from '../example/insiders-byte.ghost.2017-11-15.json';
import type { RootInterface } from './types';

type Post = {
  path: string,
  date: moment,
  title: string,
  markdown: string,
  tags: string[],
};

type Posts = Post[];

const BASE_PATH = './pages';
const root: RootInterface = json;
const dbs = root.db;

if (dbs.length !== 1) {
  throw new Error('Only 1 db is supported');
}

const db = dbs[0];
const { data } = db;

const posts: Posts = data.posts.map(
  ({ title, slug, markdown, published_at, id }) => {
    const postTags = data.posts_tags
      .filter(o => o.post_id === id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(o => o.tag_id);

    const tags = data.tags.filter(o => postTags.includes(o.id)).map(o => o.name );

    return {
      path: `/${slug}`,
      date: moment(published_at),
      title,
      markdown,
      tags,
    };
  },
);

fs.mkdirSync(BASE_PATH);

posts.forEach(({ date, path: postPath, title, tags, markdown }: Post) => {
  const basePath = path.join(
    BASE_PATH,
    `${date.format('YYYY-MM-DD')}-${title}`,
  );
  const markdownPath = path.join(basePath, 'index.md');

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
