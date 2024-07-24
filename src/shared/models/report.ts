export interface Report {
  id?: string,
  reporter?: string,
  reportedAccountId?: string,
  content?: string,
  type?: string,
  category?: string,
  mediaId?: string,
  datePublished?: Date,
  resolved?: boolean,
  resolvedBy?:string,
  dateResolved?: Date,
  solution?:string,
  reason?:string,

}
