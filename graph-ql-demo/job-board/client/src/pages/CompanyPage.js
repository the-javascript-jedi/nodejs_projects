import { useParams } from "react-router";
// import { companies } from '../lib/fake-data';
import { useEffect, useState } from "react";
import { getCompanies } from "../lib/graphql/queries";

function CompanyPage() {
  const { companyId } = useParams();
  const [state, setState] = useState({
    company: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const company = await getCompanies(companyId);
        setState({ company, loading: false, error: false });
      } catch (error) {
        console.log("error", JSON.stringify(error, null, 2));
        setState({ company: null, loading: false, error: true });
      }
    })();
  }, [companyId]);

  console.log("[CompanyPage] state:", state);
  const { company, loading, error } = state;
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error Data Unavailable...</div>;
  }
  // const company = companies.find((company) => company.id === companyId);
  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <div>
        <h2>Company Jobs</h2>
        <div>
          {company.jobs.length > 0 ? (
            company.jobs.map((job) => (
              <div>
                <div>Date: {job.date}</div>
                <div>Description: {job.description}</div>
              </div>
            ))
          ) : (
            <div>No Jobs</div>
          )}
        </div>
      </div>
    </div>
  );
}
export default CompanyPage;
