export interface Content {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  video?: string;
  visibility: 'public' | 'restricted';
  createdAt: string;
}
