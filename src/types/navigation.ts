export type RootStackParamList = {
  InitView: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  Tab: undefined;
  Account: undefined;
  BlogDetail: {
    blog: {
      id: number;
      title: string;
      author: string;
      date: string;
      content?: string;
      image?: string;
      readTime?: string;
      tags?: string[];
    };
  };
  BlogsList: undefined;
  TipsDetail: undefined;
  Profile: undefined;
};
