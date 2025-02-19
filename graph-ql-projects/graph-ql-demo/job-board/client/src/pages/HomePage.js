import { useEffect, useState } from "react";
import JobList from "../components/JobList";
// import { jobs } from "../lib/fake-data";
import { getJobs } from "../lib/graphql/queries";

function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  let limit = 3; // Set your desired limit
  let offset = (currentPage - 1) * limit; // Set your desired offset
  useEffect(() => {
    getJobs(limit, offset).then((jobs) => setJobs(jobs));
  }, [currentPage]);

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
      <span>{currentPage}</span>
      <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      <JobList jobs={jobs} />
    </div>
  );
}
export default HomePage;
