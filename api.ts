// api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const createUser = async (user: { email: string; username: string }) => {
  const { data } = await api.post('/0/users', user);
  return data;
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

export const updateGoalCompletion = async ({ goalId, is_completed }: { goalId: string; is_completed: boolean }) => {
  const { data } = await api.patch(`/0/goals/${goalId}`, { is_completed });
  return data;
};
