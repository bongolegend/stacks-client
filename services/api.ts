import axios from 'axios';
import config from '../config';
import { User, EmojiType, Goal, Milestone, Post } from '../types/requests';

const api = axios.create({
  baseURL: config.stacksAPI,
});

export const createUser = async (user: { email: string; username: string }) => {
  const { data } = await api.post('/0/users', user);
  return data;
};

export const loginUser = async (username: string) => {
  const { data } = await api.get(`/0/users?username=${username}`);
  return data[0];
};

export const createGoal = async (goal: { user_id: string; title?: string; description: string; is_completed: boolean; due_date?: string }) => {
  const { data } = await api.post('/0/goals', goal);
  return data;
};

export const createMilestone = async (task: { user_id: string; goal_id: string; description: string; is_completed: boolean }) => {
  const { data } = await api.post('/0/tasks', task);
  return data;
};

export const fetchGoals = async (user_id: string): Promise<Goal[]> => {
  try {
    const { data } = await api.get(`/0/goals?user_id=${user_id}`);
    const goals = data.map((goal: any) => Goal.parse(goal));
    return goals;
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
};

export const fetchMilestones = async (user_id: string): Promise<Milestone[]> => {
  try {
    const { data } = await api.get(`/0/tasks?user_id=${user_id}`);
    const milestones = data.map((milestone: any) => Milestone.parse(milestone));
    return milestones;
  } catch (error) {
    console.error('Error fetching milestones:', error);
    throw error;
  }
};

export const fetchTimeline = async (user_id: string): Promise<Post[]> => {
  try {
    const { data } = await api.get(`/0/timelines/${user_id}/leaders`);
    const posts = data.map((result: any) => {
      const parsed = Post.safeParse(result);
      if (!parsed.success) {
        console.error('Error parsing post:', parsed.error.format());
        return null;
      } else {
        return parsed.data;
      }
    }).filter((post: Post | null): post is Post => post !== null);
    return posts;
  } catch (error) {
    console.error('Error fetching timeline:', error);
    throw error;
  }
};

export const fetchUsers = async (user_id: string) => {
  const { data } = await api.get(`/0/users/${user_id}/search`);
  return data;
};

export const followUser = async (follower_id: string, leader_id: string) => {
  const { data } = await api.post('/0/follows', { follower_id, leader_id });
  return data;
};

export const unfollowUser = async (follower_id: string, leader_id: string) => {
  const { data } = await api.delete(`/0/follows/${follower_id}/leaders/${leader_id}`);
  return data;
};

export const updateGoalCompletion = async ({ id, is_completed }: { id: string; is_completed: boolean }) => {
  const { data } = await api.patch(`/0/goals/${id}`, { is_completed });
  return data;
};

export const updateTaskCompletion = async ({ id, is_completed }: { id: string; is_completed: boolean }) => {
  const { data } = await api.patch(`/0/tasks/${id}`, { is_completed });
  return data;
};

export const addReactionToPost = async (userId: string, post: Post, emoji: EmojiType) => {
  const reaction = post.task
  ? { user_id: userId, task_id: post.task.id, reaction: emoji, reaction_library: "rn-emoji-keyboard:^1.7.0" }
  : { user_id: userId, goal_id: post.goal.id, reaction: emoji, reaction_library: "rn-emoji-keyboard:^1.7.0" };

  const { data } = await api.post(`/0/reactions`, reaction);
  return data;
};

export const addCommentToPost = async ({ post, userId, comment }: { post: Post; userId: string; comment: string }) => {
  const commentData = post.task 
    ? { user_id: userId, task_id: post.task.id, comment } 
    : { user_id: userId, goal_id: post.goal.id, comment };    
  const { data } = await api.post(`/0/comments`, commentData);
  return data;
};

export const fetchCommentsForPost = async (post: Post) => {
  const queryArgs = post.task ? `task_id=${post.task.id}` : `goal_id=${post.goal.id}`;
  const { data } = await api.get(`/0/comments?${queryArgs}`);
  return data;
};

export const fetchFollowers = async (user_id: string): Promise<User[]> => {
  const { data } = await api.get(`/0/users/followers/${user_id}`);
  return data.map((user: any) => User.parse(user));
};

export const fetchLeaders = async (user_id: string): Promise<User[]> => {
  const { data } = await api.get(`/0/users/leaders/${user_id}`);
  return data.map((user: any) => User.parse(user));
};

export const fetchFollowCounts = async (user_id: string): Promise<{ followers: number; leaders: number }> => {
  const { data } = await api.get(`/0/follows/counts/${user_id}`);
  return data;
};