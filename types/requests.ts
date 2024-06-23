import { z } from 'zod';

// add strict type checking to all requests

export const User = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  leader: z.boolean().optional(),
}).brand<"User">();

export type User = z.infer<typeof User>;

export const Goal = z.object({
    id: z.string(),
    user_id: z.string(),
    title: z.string(),
    description: z.string(),
    is_completed: z.boolean(),
    due_date: z.string().optional(),
    created_at: z.string(),
    updated_at: z.string(),
  }).brand<"Goal">();
  
export type Goal = z.infer<typeof Goal>;


export const Milestone = z.object({
  id: z.string(),
  user_id: z.string(),
  goal_id: z.string(),
  description: z.string(),
  is_completed: z.boolean(),
  // due_date: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
}).brand<"Milestone">();

export type Milestone = z.infer<typeof Milestone>;

// hardcoded emoji data from rn-emoji-keyboard lib
export const EmojiType = z.object({
  emoji: z.string(),
  name: z.string(),
  slug: z.string(),
  unicode_version: z.string(),
  toneEnabled: z.boolean(),
  alreadySelected: z.boolean().optional(),
}).brand<"EmojiType">();

export type EmojiType = z.infer<typeof EmojiType>;

export const Reaction = z.object({
  id: z.string(),
  user_id: z.string(),
  reaction: z.record(z.any()),
  reaction_library: z.string(),
  task_id: z.union([z.string(), z.null()]),
  goal_id: z.union([z.string(), z.null()]),
}).brand<"Reaction">();

export type Reaction = z.infer<typeof Reaction>;

export const Post = z.object({
  id: z.string(),
  user: User,
  goal: Goal,
  task: z.union([Milestone, z.null()]),
  reactions: z.array(Reaction),
  comments_count: z.number(),
  sort_on: z.string(),
  created_at: z.string(),
}).brand<"Post">();

export type Post = z.infer<typeof Post>;
