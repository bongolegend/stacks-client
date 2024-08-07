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
}).strict();

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
  }).strict();
  
export type Goal = z.infer<typeof Goal>;

export const GoalEnriched = z.object({
  id: z.string(),
  user_id: z.string(),
  parent_id: z.union([z.string(), z.null()]),
  user: User,
  parent: z.union([Goal, z.null()]),
  title: z.union([z.string(), z.null()]),
  description: z.string(),
  is_completed: z.boolean(),
  due_date: z.union([z.string(), z.null()]),
  created_at: z.string(),
  updated_at: z.string(),
}).strict();

export type GoalEnriched = z.infer<typeof GoalEnriched>;


// hardcoded emoji data from rn-emoji-keyboard lib
export const EmojiType = z.object({
  emoji: z.string(),
  name: z.string(),
  slug: z.string(),
  unicode_version: z.string(),
  toneEnabled: z.boolean(),
  alreadySelected: z.boolean().optional(),
}).strict();

export type EmojiType = z.infer<typeof EmojiType>;

export const Reaction = z.object({
  id: z.string(),
  user_id: z.string(),
  reaction: z.record(z.any()),
  reaction_library: z.string(),
  goal_id: z.union([z.string(), z.null()]),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
}).strict();

export type Reaction = z.infer<typeof Reaction>;

export const Announcement = z.object({
  id: z.string(),
  user: User,
  goal: Goal,
  parent: z.union([Goal, z.null()]),
  reactions: z.array(Reaction),
  comment_count: z.number(),
  sort_on: z.string(),
  created_at: z.string(),
}).strict();

export type Announcement = z.infer<typeof Announcement>;


export const Follow = z.object({
  follower_id: z.string(),
  leader_id: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
}).strict();

export type Follow = z.infer<typeof Follow>;

export const CommentEnriched = z.object({
  id: z.string().optional(),
  user_id: z.string(),
  goal_id: z.string(),
  comment: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  user: User.optional(),
}).strict();

export type CommentEnriched = z.infer<typeof CommentEnriched>;

export const FollowCounts = z.object({
  followers: z.number(),
  leaders: z.number(),
}).strict();

export type FollowCounts = z.infer<typeof FollowCounts>;

export const CommentCount = z.object({
  goal_id: z.string(),
  count: z.number(),
}).strict();

export type CommentCount = z.infer<typeof CommentCount>;


export const Device = z.object({
  id: z.string().optional(),
  user_id: z.string(),
  os: z.string(),
  version: z.string(),
  expo_push_token: z.string(),
  active: z.boolean(),
}).strict();

export type Device = z.infer<typeof Device>;