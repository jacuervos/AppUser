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
  BlogsList: {
    initialBlogs?: Array<{
      id: number;
      title: string;
      author: string;
      date: string;
      category: string;
      excerpt: string;
      readTime?: string;
      image?: string;
      tags?: string[];
      content?: string;
    }>;
  };
  TipsDetail: {
    initialTips?: Array<{
      id: number;
      tip: string;
      category: string;
      description?: string;
      difficulty?: 'Fácil' | 'Medio' | 'Avanzado';
      impact?: 'Bajo' | 'Medio' | 'Alto';
      steps?: string[];
    }>;
  };
  Profile: undefined;
};
