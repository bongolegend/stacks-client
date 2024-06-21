// requests.ts
import { z } from 'zod';

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
