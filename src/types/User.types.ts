import { Job } from "./Job.types";

export type User = {
  name: string;
  email: string;
  image: string;
  type: string;
  cv_full_text?: string;
  cv_file_name?: string;
  jobs?: Job[];
};
