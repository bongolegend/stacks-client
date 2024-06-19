import axios from 'axios';
import config from '../config';
import { EmojiType } from 'rn-emoji-keyboard';

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

export const createGoal = async (goal: { user_id: string; description: string; is_completed: boolean }) => {
  const { data } = await api.post('/0/goals', goal);
  return data;
};

export const createMilestone = async (task: { user_id: string; goal_id: string; description: string; is_completed: boolean }) => {
  const { data } = await api.post('/0/tasks', task);
  return data;
};

export const fetchGoals = async (user_id: string) => {
  const { data } = await api.get(`/0/goals?user_id=${user_id}`);
  return data;
};

export const fetchMilestones = async (user_id: string) => {
  const { data } = await api.get(`/0/tasks?user_id=${user_id}`);
  return data;
};

export const fetchTimeline = async (user_id: string) => {
  const { data } = await api.get(`/0/timelines/${user_id}/leaders`);
  return data;
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

export const updateGoalCompletion = async ({ goalId, is_completed }: { goalId: string; is_completed: boolean }) => {
  const { data } = await api.patch(`/0/goals/${goalId}`, { is_completed });
  return data;
};

export const updateTaskCompletion = async ({ taskId, is_completed }: { taskId: string; is_completed: boolean }) => {
  const { data } = await api.patch(`/0/tasks/${taskId}`, { is_completed });
  return data;
};

export const addReactionToPost = async (userId: string, post: any, emoji: EmojiType) => {
  const reaction = {
    user_id: userId,
    goal_id: post.primary.table === 'goals' ? post.primary.id : null,
    task_id: post.primary.table === 'tasks' ? post.primary.id : null,
    reaction: emoji,
    reaction_library: "rn-emoji-keyboard:^1.7.0",
  };
  const { data } = await api.post(`/0/reactions`, reaction);
  return data;
};

export const addCommentToPost = async ({ post, userId, comment }: { post: any; userId: string; comment: string }) => {
  const commentData = {
    user_id: userId,
    goal_id: post.primary.table === 'goals' ? post.primary.id : null,
    task_id: post.primary.table === 'tasks' ? post.primary.id : null,
    comment,
  };
  const { data } = await api.post(`/0/comments`, commentData);
  return data;
};

export const fetchCommentsForPost = async (post: any) => {
  const queryArgs = post.primary.table === 'goals' ? `goal_id=${post.primary.id}` : `task_id=${post.primary.id}`;
  const { data } = await api.get(`/0/comments?${queryArgs}`);
  return data;
};