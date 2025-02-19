// import { GraphQLClient } from "graphql-request";
import { getAccessToken } from "../auth";
import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  gql,
  InMemoryCache,
} from "@apollo/client";

// using graphql client
// const client = new GraphQLClient("http://localhost:9000/graphql", {
//   headers: () => {
//     const accessToken = getAccessToken();
//     if (accessToken) {
//       return { Authorization: `Bearer ${accessToken}` };
//     }
//     return {};
//   },
// });

// use apollo client

const httpLink = createHttpLink({ uri: "http://localhost:9000/graphql" });

const authLink = new ApolloLink((operation, forward) => {
  console.log("[authLink] operation:", operation);
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});
const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

//define the getJob by ID function globally
// fragment for code reuse

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    date
    title
    company {
      id
      name
    }
    description
  }
`;
const jobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  # add the jobDetailFragment definition as an expression
  ${jobDetailFragment}
`;

// mutation for post request - creating a job
export async function createJobQuery({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        ...JobDetail
      }
    }
    # add the jobDetailFragment definition as an expression
    ${jobDetailFragment}
  `;
  // using graphql client
  // const { job } = await client.request(mutation, {
  //   input: { title, description },
  // });
  // return job;
  // using apollo client
  const { data } = await apolloClient.mutate({
    mutation,
    variables: { input: { title, description } },
    update: (cache, result) => {
      console.log("[createJob] result:", result);
      // write data returned from mutation directly to cache, as if it was written directly by jobById query
      cache.writeQuery({
        query: jobByIdQuery,
        variables: { id: result.data.job.id },
        data: result.data,
      });
    },
  });
  return data.job;
}

export async function getJob(id) {
  // const query = gql`
  //   query JobById($id: ID!) {
  //     job(id: $id) {
  //       id
  //       date
  //       title
  //       company {
  //         id
  //         name
  //       }
  //       description
  //     }
  //   }
  // `;
  // using graphql client
  // const { job } = await client.request(query, { id });
  // return job;
  // using apollo client
  const { data } = await apolloClient.query({
    // pass the query commonly written globally
    query: jobByIdQuery,
    variables: { id },
  });
  return data.job;
}

export async function getJobs() {
  const query = gql`
    query Jobs {
      jobs {
        id
        date
        title
        company {
          id
          name
        }
      }
    }
  `;
  // using graphql client
  // const { jobs } = await client.request(query);
  // return jobs;
  // using apolloClient
  const result = await apolloClient.query({
    query,
    fetchPolicy: "network-only",
  });
  return result.data.jobs;
}

export async function getCompanies(id) {
  console.log("id", id);
  const query = gql`
    query CompanyById($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          date
          description
        }
      }
    }
  `;
  const { company } = await apolloClient.request(query, { id });
  return company;
}

