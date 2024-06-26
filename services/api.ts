import axios from 'axios';
import config from '../config';
import { User, EmojiType, Goal, Announcement, Follow, Reaction, CommentEnriched, FollowCounts, GoalEnriched } from '../types/requests';

const api = axios.create({
  baseURL: config.stacksAPI,
});

export const createUser = async (user: User): Promise<User> => {
  const { data } = await api.post('/0/users', user);
  const parsed = User.safeParse(data);
  if (!parsed.success) {
    console.error('Error parsing User:', parsed.error.format());
    throw new Error('Error parsing User');
  }
  return parsed.data;
};

export const loginUser = async (username: string): Promise<User> => {
  const { data } = await api.get(`/0/users?username=${username}`);
  const parsed = User.safeParse(data[0]);
  if (!parsed.success) {
    console.error('Error parsing User:', parsed.error.format());
    throw new Error('Error parsing User');
  }
  return parsed.data;
};

export const createGoal = async (goal: Goal): Promise<Goal> => {
  const { data } = await api.post('/0/goals', goal);
  const parsed = Goal.safeParse(data);
  if (!parsed.success) {
    console.error('Error parsing Goal:', parsed.error.format());
    throw new Error('Error parsing Goal');
  }
  return parsed.data;
};

export const fetchGoals = async (user_id: string): Promise<GoalEnriched[]> => {
  const { data } = await api.get(`/0/goals/${user_id}`);
  const goals = data.map((goal: any) => {
    const parsed = GoalEnriched.safeParse(goal);
    if (!parsed.success) {
      console.error('Error parsing Goal:', parsed.error.format());
      return null;
    } else {
      return parsed.data;
    }
  });
  return goals;
};

export const fetchAnnouncements = async (user_id: string): Promise<GoalEnriched[]> => {
  const { data } = await api.get(`/0/goals/announcements/${user_id}`);
  const announcements = data.map((result: any) => {
    const parsed = GoalEnriched.safeParse(result);
    if (!parsed.success) {
      console.error('Error parsing GoalEnriched:', parsed.error.format());
      return null;
    } else {
      return parsed.data;
    }
  });
  return announcements;
};

export const followUser = async (follower_id: string, leader_id: string): Promise<Follow> => {
  const { data } = await api.post('/0/follows', { follower_id, leader_id });
  const parsed = Follow.safeParse(data);
  if (!parsed.success) {
    console.error('Error parsing Follow:', parsed.error.format());
    throw new Error('Error parsing Follow');
  }
  return parsed.data;
};

export const unfollowUser = async (follower_id: string, leader_id: string): Promise<Follow> => {
  const { data } = await api.delete(`/0/follows/${follower_id}/leaders/${leader_id}`);
  const parsed = Follow.safeParse(data);
  if (!parsed.success) {
    console.error('Error parsing Follow:', parsed.error.format());
    throw new Error('Error parsing Follow');
  }
  return parsed.data;
};

export const updateGoalCompletion = async ({ id, is_completed }: { id: string; is_completed: boolean }): Promise<Goal> => {
  const { data } = await api.patch(`/0/goals/${id}`, { is_completed });
  const parsed = Goal.safeParse(data);
  if (!parsed.success) {
    console.error('Error parsing Goal:', parsed.error.format());
    throw new Error('Error parsing Goal');
  }
  return parsed.data;
};

export const addReaction = async (userId: string, goalId: string, emoji: EmojiType): Promise<Reaction> => {
  const reaction = { user_id: userId, goal_id: goalId, reaction: emoji, reaction_library: "rn-emoji-keyboard:^1.7.0" };
  const { data } = await api.post(`/0/reactions`, reaction);
  const parsed = Reaction.safeParse(data);
  if (!parsed.success) {
    console.error('Error parsing Reaction:', parsed.error.format());
    throw new Error('Error parsing Reaction');
  }
  return parsed.data;
};

export const fetchReactions = async (goalId: string): Promise<Reaction[]> => {
  const { data } = await api.get(`/0/reactions?goal_id=${goalId}`);
  const reactions = data.map((reaction: any) => {
    const parsed = Reaction.safeParse(reaction);
    if (!parsed.success) {
      console.error('Error parsing Reaction:', parsed.error.format());
      return null;
    } else {
      return parsed.data;
    }
  });
  return reactions;
}

export const addComment = async (comment: Comment): Promise<Comment> => {
  const { data } = await api.post(`/0/comments`, comment);
  const parsed = CommentEnriched.safeParse(data);
  if (!parsed.success) {
    console.error('Error parsing Comment:', parsed.error.format());
    throw new Error('Error parsing Comment');
  }
  return parsed.data;
};

export const fetchComments = async (goalId: string): Promise<CommentEnriched[]> => {
  const { data } = await api.get(`/0/comments?goal_id=${goalId}`);
  const comments = data.map((comment: any) => {
    const parsed = CommentEnriched.safeParse(comment);
    if (!parsed.success) {
      console.error('Error parsing Comment:', parsed.error.format());
      return null;
    } else {
      return parsed.data;
    }
  });
  return comments;
};

export const fetchUsers = async (user_id: string): Promise<User[]> => {
  const { data } = await api.get(`/0/users/search/${user_id}`);
  const users = data.map((user: any) => {
    const parsed = User.safeParse(user);
    if (!parsed.success) {
      console.error('Error parsing User:', parsed.error.format());
      return null;
    } else {
      return parsed.data;
    }
  });
  return users;
};

export const fetchFollowers = async (user_id: string): Promise<User[]> => {
  const { data } = await api.get(`/0/users/followers/${user_id}`);
  const users = data.map((user: any) => {
    const parsed = User.safeParse(user);
    if (!parsed.success) {
      console.error('Error parsing User:', parsed.error.format());
      return null;
    } else {
      return parsed.data;
    }
  });
  return users;
};

export const fetchLeaders = async (user_id: string): Promise<User[]> => {
  const { data } = await api.get(`/0/users/leaders/${user_id}`);
  const users = data.map((user: any) => {
    const parsed = User.safeParse(user);
    if (!parsed.success) {
      console.error('Error parsing User:', parsed.error.format());
      return null;
    } else {
      return parsed.data;
    }
  });
  return users;
};

export const fetchFollowCounts = async (user_id: string): Promise<FollowCount> => {
  const { data } = await api.get(`/0/follows/counts/${user_id}`);
  const parsed = FollowCounts.safeParse(data);
  if (!parsed.success) {
    console.error('Error parsing FollowCount:', parsed.error.format());
    throw new Error('Error parsing FollowCount');
  }
  return data;
};