// api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
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

export const createTask = async (task: { user_id: string; goal_id: string; description: string; is_completed: boolean }) => {
  const { data } = await api.post('/0/tasks', task);
  return data;
};

export const fetchGoals = async (user_id: string) => {
  const { data } = await api.get(`/0/goals?user_id=${user_id}`);
  return data;
};

export const fetchTasks = async (user_id: string) => {
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
