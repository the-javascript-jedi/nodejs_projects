import { getCompany } from "./db/companies.js";
import { createJob, getJob, getJobs, getJobsByCompany } from "./db/jobs.js";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    job: async (_root, args) => {
      const job = await getJob(args["id"]);
      console.log("job", job);
      if (!job) {
        throw notFoundError("No Job found with id " + args["id"]);
      }
      console.log("[Query.job] args", args);
      return getJob(args.id);
    },
    jobs: async () => {
      const jobs = await getJobs();
      console.log("jobs", jobs);
      return jobs;
    },
    company: async (_root, args) => {
      console.log("[Query.company] args", args);
      const companies = await getCompany(args["id"]);
      console.log("companies", companies);
      if (!companies) {
        throw notFoundError("No Company found with id" + id);
      }
      return companies;
    },
  },
  Mutation: {
    createJob: (_root, { input: { title, description } }) => {
      const companyId = "FjcJCHJALA4i"; // TODO set based on user
      // import the node insertion function
      return createJob({ companyId, title, description });
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

function notFoundError(message) {
  return new GraphQLError(message, {
    // custom error code
    extensions: { code: "NOT_FOUND" },
  });
}
