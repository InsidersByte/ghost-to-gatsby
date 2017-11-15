// @flow

type Settings = {
  id: number,
  uuid: string,
  key: string,
  value: string,
  type: string,
  created_at: string,
  created_by: number,
  updated_at: string,
  updated_by: number,
};

type Tags = {
  id: number,
  uuid: string,
  name: string,
  slug: string,
  description: string,
  image: string,
  parent_id: string,
  visibility: string,
  meta_title: string,
  meta_description: string,
  created_at: string,
  created_by: number,
  updated_at: string,
  updated_by: number,
};

type Users = {
  id: number,
  uuid: string,
  name: string,
  slug: string,
  password: string,
  email: string,
  image: string,
  cover: string,
  bio: string,
  website: string,
  location: string,
  facebook: string,
  twitter: string,
  accessibility: string,
  status: string,
  language: string,
  visibility: string,
  meta_title: string,
  meta_description: string,
  tour: string,
  last_login: string,
  created_at: string,
  created_by: number,
  updated_at: string,
  updated_by: number,
};

type Meta = {
  exported_on: number,
  version: string,
};

type Permissions = {
  id: number,
  uuid: string,
  name: string,
  object_type: string,
  action_type: string,
  object_id: string,
  created_at: string,
  created_by: number,
  updated_at: string,
  updated_by: number,
};

type PermissionsRoles = {
  id: number,
  role_id: number,
  permission_id: number,
};

type Posts = {
  id: number,
  uuid: string,
  title: string,
  slug: string,
  markdown: string,
  mobiledoc: string,
  html: string,
  amp: string,
  image: string,
  featured: number,
  page: number,
  status: string,
  language: string,
  visibility: string,
  meta_title: string,
  meta_description: string,
  author_id: number,
  created_at: string,
  created_by: number,
  updated_at: string,
  updated_by: number,
  published_at: string,
  published_by: string,
};

type PostsTags = {
  id: number,
  post_id: number,
  tag_id: number,
  sort_order: number,
};

type Roles = {
  id: number,
  uuid: string,
  name: string,
  description: string,
  created_at: string,
  created_by: number,
  updated_at: string,
  updated_by: number,
};

type RolesUsers = {
  id: number,
  role_id: number,
  user_id: number,
};

type Data = {
  posts: Posts[],
  users: Users[],
  roles: Roles[],
  roles_users: RolesUsers[],
  permissions: Permissions[],
  permissions_users: any[],
  permissions_roles: PermissionsRoles[],
  permissions_apps: any[],
  settings: Settings[],
  tags: Tags[],
  posts_tags: PostsTags[],
  apps: any[],
  app_settings: any[],
  app_fields: any[],
  subscribers: any[],
};

type Db = {
  meta: Meta,
  data: Data,
};

export type RootInterface = {
  db: Db[],
};
