import { z } from 'zod';

// add strict type checking to all requests

export const User = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  follower: z.union([z.boolean(), z.null()]).optional(),
  leader: z.union([z.boolean(), z.null()]).optional(),
}).strict().brand<"User">();

export type User = z.infer<typeof User>;

export const Goal = z.object({
    id: z.string(),
    user_id: z.string(),
    parent_id: z.union([z.string(), z.null()]),
    title: z.union([z.string(), z.null()]),
    description: z.string(),
    is_completed: z.boolean(),
    due_date: z.union([z.string(), z.null()]),
    created_at: z.string(),
    updated_at: z.string(),
  }).strict().brand<"Goal">();
  
export type Goal = z.infer<typeof Goal>;


// hardcoded emoji data from rn-emoji-keyboard lib
export const EmojiType = z.object({
  emoji: z.string(),
  name: z.string(),
  slug: z.string(),
  unicode_version: z.string(),
  toneEnabled: z.boolean(),
  alreadySelected: z.boolean().optional(),
}).strict().brand<"EmojiType">();

export type EmojiType = z.infer<typeof EmojiType>;

export const Reaction = z.object({
  id: z.string(),
  user_id: z.string(),
  reaction: z.record(z.any()),
  reaction_library: z.string(),
  task_id: z.union([z.string(), z.null()]),
  goal_id: z.union([z.string(), z.null()]),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
}).strict().brand<"Reaction">();

export type Reaction = z.infer<typeof Reaction>;

export const Post = z.object({
  id: z.string(),
  user: User,
  goal: Goal,
  parent: z.union([Goal, z.null()]),
  reactions: z.array(Reaction),
  comments_count: z.number(),
  sort_on: z.string(),
  created_at: z.string(),
}).strict().brand<"Post">();

export type Post = z.infer<typeof Post>;


export const Follow = z.object({
  follower_id: z.string(),
  leader_id: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
}).strict().brand<"Follow">();

export type Follow = z.infer<typeof Follow>;

export const Comment = z.object({
  id: z.string().optional(),
  user_id: z.string(),
  goal_id: z.string(),
  comment: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
}).strict().brand<"Comment">();

export type Comment = z.infer<typeof Comment>;