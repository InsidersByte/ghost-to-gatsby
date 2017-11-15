// @flow

import moment from 'moment';
import fs from 'fs';
import path from 'path';
import json from '../example/insiders-byte.ghost.2017-11-15.json';
import type { RootInterface } from './types';

type ProcessedPost = {
  path: string,
  date: moment,
  title: string,
  markdown: string,
  tags: string[],
};

type ProcessedPosts = ProcessedPost[];

const BASE_PATH = './pages';
const root: RootInterface = json;
const dbs = root.db;

if (dbs.length !== 1) {
  throw new Error('Only 1 db is supported');
}

const db = dbs[0];
const { data } = db;
const { posts } = data;

const processedPosts: ProcessedPosts = posts.map(({ title, slug, markdown, published_at }) => ({
  path: `/${slug}`,
  date: moment(published_at),
  title,
  markdown,
  tags: [],
}));

fs.mkdirSync(BASE_PATH);

processedPosts.forEach((post: ProcessedPost) => {
  const basePath = path.join(BASE_PATH, `${post.date.format("YYYY-MM-DD")}-${post.title}`);
  const markdownPath = path.join(basePath, "index.md");

  fs.mkdirSync(basePath);
  fs.writeFileSync(markdownPath, `---
path: "${post.path}"
date: "${post.date.toISOString()}"
title: "${post.title}"
tags: []
---

${post.markdown}
  `)
});
