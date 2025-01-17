import { getJobs } from "./db/jobs.js";

export const resolvers = {
  Query: {
    jobs: async () => {
      const jobs = await getJobs();
      console.log("jobs", jobs);
      return jobs;
    },
  },

  Job: {
    date: (job) => {
      console.log("job", job);
      return job.createdAt.slice(0, "yyyy-mm-dd".length);
    },
  },
};
