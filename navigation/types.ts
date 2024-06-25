export type RootStackParamList = {
    Login: undefined;
    InApp: { userId: string };
    CreateGoal: { userId: string };
    CreateMilestone: { userId: string };
    Comments: { postId: string };
  };
