import { getCompany } from "./db/companies.js";
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
    company: (job) => {
      // getCompany will return the id amd description of each company
      // return {
      //   id: "test-company-id",
      //   description: "test-desc-id",
      // };
      return getCompany(job.companyId);
    },
    date: (job) => {
      console.log("job", job);
      return job.createdAt.slice(0, "yyyy-mm-dd".length);
    },
  },
};
