export interface IssueRequest {
  email: string;
  username: string;
  password: string;
  displayName: string;
  applicationRoles: string[];
  issueSummary: string;
  collection: string;
  link: string;
  priority: string;
}
