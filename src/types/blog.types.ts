export interface InterfaceBlog {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
}

export interface InterfaceBlogResponse {
  data: InterfaceBlog[];
}