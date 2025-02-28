import { getCompany } from "./db/companies.js";
import {
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getJobsByCompany,
  updateJob,
  countJobs,
} from "./db/jobs.js";
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
    jobs: async (_root, { limit, offset }) => {
      const items = await getJobs(limit, offset);
      const totalCount = await countJobs(); // Or get actual total count from your DB
      return {
        items,
        totalCount,
      };
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
    createJob: (_root, { input: { title, description } }, context) => {
      console.log("[createJob] context:", context);
      if (!context.user) {
        throw unauthorizedError("Missing authentication");
      }
      return createJob({
        companyId: context.user.companyId,
        title,
        description,
      });
    },
    deleteJob: async (_root, { id }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }
      const job = await deleteJob(id, user.companyId);
      if (!job) {
        throw notFoundError("No Job found with id" + id);
      }
      return job;
    },
    updateJob: async (
      _root,
      { input: { id, title, description } },
      { user }
    ) => {
      console.log(" id, title, description ", id, title, description);
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }
      const job = await updateJob({
        id,
        companyId: user.companyId,
        title,
        description,
      });
      if (!job) {
        throw notFoundError("No Job found with id" + id);
      }
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

function unauthorizedError(message) {
  return new GraphQLError(message, {
    extensions: {
      code: "UNAUTHORIZED",
    },
  });
}
