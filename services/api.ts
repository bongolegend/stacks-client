import axios from 'axios';
import config from '../config';
import { User, EmojiType, Goal, Post, Follow, Reaction } from '../types/requests';

const api = axios.create({
  baseURL: config.stacksAPI,
});

export const createUser = async (user: User): Promise<User> => {
  const { data } = await api.post('/0/users', user);
  return data;
};

export const loginUser = async (username: string): Promise<User> => {
  const { data } = await api.get(`/0/users?username=${username}`);
  return data[0];
};

export const createGoal = async (goal: Goal): Promise<Goal> => {
  const { data } = await api.post('/0/goals', goal);
  return data;
};

export const createSubgoal = async (subgoal: Goal): Promise<Goal> => {
  const { data } = await api.post('/0/goals', {
    user_id: subgoal.user_id, 
    parent_id: subgoal.parent_id, 
    description: subgoal.description, 
    is_completed: subgoal.is_completed});
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

export const fetchTimeline = async (user_id: string): Promise<Post[]> => {
  const { data } = await api.get(`/0/timelines/${user_id}/leaders`);
  const posts = data.map((result: any) => {
    const parsed = Post.safeParse(result);
    if (!parsed.success) {
      console.error('Error parsing post:', parsed.error.format());
      return null;
    } else {
      return parsed.data;
    }
  });
  return posts;
};


export const followUser = async (follower_id: string, leader_id: string): Promise<Follow>  => {
  const { data } = await api.post('/0/follows', { follower_id, leader_id });
  return data;
};

export const unfollowUser = async (follower_id: string, leader_id: string) => {
  console.log('unfollowing', follower_id, leader_id);
  const { data } = await api.delete(`/0/follows/${follower_id}/leaders/${leader_id}`);
  return data;
};

export const updateGoalCompletion = async ({ id, is_completed }: { id: string; is_completed: boolean }): Promise<Goal> => {
  const { data } = await api.patch(`/0/goals/${id}`, { is_completed });
  return data;
};

export const addReaction = async (userId: string, goalId: string, emoji: EmojiType): Promise<Reaction> => {
  const reaction = { user_id: userId, goal_id: goalId, reaction: emoji, reaction_library: "rn-emoji-keyboard:^1.7.0" }
  const { data } = await api.post(`/0/reactions`, reaction);
  return data;
};

export const addComment = async (comment: Comment): Promise<Comment> => {
  const { data } = await api.post(`/0/comments`, comment);
  return data;
};

export const fetchComments = async (goalId: string): Promise<Comment[]> => {
  const { data } = await api.get(`/0/comments?goal_id=${goalId}`);
  return data;
};

export const fetchUsers = async (user_id: string): Promise<User[]> => {
  const { data } = await api.get(`/0/users/${user_id}/search`);
  return data.map((user: any) => User.parse(user));
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