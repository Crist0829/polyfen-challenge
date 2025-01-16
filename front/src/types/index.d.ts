export interface Prospect {
  name: string;
  email: string;
  country: string;
  jobTitle: JobTitle;
  yearsOfExperience: number;
  industry: Industry;
  companySize: number | string;
  score: number
}

export interface Industry{
  name:string
  score:number
  _id:string
}
export interface JobTitle{
  name:string
  score:number
  _id:string
}