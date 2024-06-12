export interface Comment {
  id?: string,
  authorId: string,
  videoId: string,
  datePublished?: string,
  authorName:string,
  authorAvatar: string,
  content: string,
  likes: number,
  dislikes: number,
  extended?: boolean,

}
