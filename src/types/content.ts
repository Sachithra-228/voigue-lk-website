export type WorkSetup = "Remote" | "Hybrid" | "On-site";

export type PublicJob = {
  _id?: string;
  title: string;
  slug: string;
  summary?: string;
  workSetup?: WorkSetup;
  department?: string;
  location?: string;
  employmentType?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  salaryRange?: string;
  status?: string;
  featured?: boolean;
};

export type PublicPost = {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  category?: string;
  author?: string;
  published?: boolean;
  publishedAt?: string | Date;
  tags?: string[];
};

export type PublicVoice = {
  name: string;
  role: string;
  quote: string;
  image?: string;
};

export type MomentCategory = "Parties" | "Events" | "Community";

export type PublicMoment = {
  title: string;
  category: MomentCategory;
  image?: string;
};
