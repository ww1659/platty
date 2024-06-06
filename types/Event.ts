export type Event = {
  id: number;
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string;
  price: number;
  tagline: string;
  communityId: string;
  memberCount?: number;
};
