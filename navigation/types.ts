export type RootStackParamList = {
    Login: undefined;
    FirebaseLogin: undefined;
    InApp: { userId: string };
    CreateGoal: { userId: string };
    CreateMilestone: { userId: string };
    Comments: { announcementId: string };
    Followers: undefined;
    Leaders: undefined;
  };
