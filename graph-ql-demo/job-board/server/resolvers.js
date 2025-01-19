import { getCompany } from "./db/companies.js";
import { getJob, getJobs, getJobsByCompany } from "./db/jobs.js";

export const resolvers = {
  Query: {
    job: (_root, args) => {
      console.log("[Query.job] args", args);
      return getJob(args.id);
    },
    jobs: async () => {
      const jobs = await getJobs();
      console.log("jobs", jobs);
      return jobs;
    },
    company: (_root, args) => {
      console.log("[Query.company] args", args);
      const companies = getCompany(args["id"]);
      return companies;
    },
  },
  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },
  Job: {
    company: (job) => {
      // getCompany will return the id and description of each company
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
