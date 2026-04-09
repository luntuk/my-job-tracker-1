import { FormRow, FormRowSelect, SubmitBtn } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useOutletContext } from 'react-router-dom';
import { JOB_STATUS, JOB_TYPE } from '../../../utils/constants';
import { Form, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

export const action =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
      await customFetch.post('/jobs', data);
      queryClient.invalidateQueries(['jobs']);
      toast.success('Job added successfully ');
      return redirect('all-jobs');
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return error;
    }
  };

const AddJob = () => {
  const { user } = useOutletContext();

  return (
    <Wrapper>
      {user?.email === 'demo@example.com' && (
        <div style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #ffe6e6 0%, #ffcccc 100%)',
          border: '2px solid var(--primary-400)',
          borderRadius: '12px',
          marginBottom: '1rem',
          boxShadow: '0 4px 15px rgba(147, 51, 234, 0.1)'
        }}>
          <p style={{ margin: 0, color: 'var(--primary-700)', fontWeight: '600' }}>
            ⚠️ <strong>Demo Account Notice:</strong> You're using my demo account! 
            The jobs you add here won't be saved. To create and manage real job applications, 
            please set up MongoDB and register with your own account. This is just for testing the features! 🎯
          </p>
        </div>
      )}
      <Form method='post' className='form'>
        <h4 className='form-title'>➕ add new job</h4>
        <div className='form-center'>
          <FormRow type='text' name='position' />
          <FormRow type='text' name='company' />
          <FormRow
            type='text'
            labelText='job location'
            name='jobLocation'
            defaultValue={user.location}
          />
          <FormRowSelect
            labelText='job status'
            name='status'
            defaultValue={JOB_STATUS.PENDING}
            list={Object.values(JOB_STATUS)}
          />
          <FormRowSelect
            labelText='job type'
            name='jobType'
            defaultValue={JOB_TYPE.FULL_TIME}
            list={Object.values(JOB_TYPE)}
          />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};
export default AddJob;
