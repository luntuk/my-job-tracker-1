import { toast } from 'react-toastify';
import { JobsContainer, SearchContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext, createContext } from 'react';
import { useQuery } from '@tanstack/react-query';

const allJobsQuery = (params) => {
  const { search, status, jobType, sort, page } = params;
  return {
    queryKey: [
      'jobs',
      search ?? '',
      status ?? 'all',
      jobType ?? 'all',
      sort ?? 'newest',
      page ?? 1,
    ],
    queryFn: async () => {
      const { data } = await customFetch.get('/jobs', {
        params,
      });
      return data;
    },
  };
};

export const loader =
  (queryClient) =>
  async ({ request }) => {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    await queryClient.ensureQueryData(allJobsQuery(params));
    return { searchValues: { ...params } };
  };

const AllJobsContext = createContext();
const AllJobs = () => {
  const { searchValues } = useLoaderData();
  const { data } = useQuery(allJobsQuery(searchValues));
  
  return (
    <AllJobsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      {data?.msg && (
        <div style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%)',
          border: '2px solid var(--primary-300)',
          borderRadius: '12px',
          marginBottom: '1rem',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(147, 51, 234, 0.1)'
        }}>
          <h4 style={{ color: 'var(--primary-700)', marginBottom: '0.5rem' }}>🎯 Demo Mode Active</h4>
          <p style={{ marginBottom: 0, color: 'var(--text-secondary-color)' }}>
            Hey! You're using the demo account I created. To add real jobs and save your data, 
            please set up MongoDB and create your own account. This demo is just for testing! 🚀
          </p>
        </div>
      )}
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};

export const useAllJobsContext = () => useContext(AllJobsContext);

export default AllJobs;
