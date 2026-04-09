import { Form, redirect, Link } from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { FormRow, Logo, SubmitBtn } from '../components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    const response = await customFetch.post('/auth/register', data);
    const { token, user } = response.data;
    
    // Save token and user to localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    toast.success('Registration successful');
    return redirect('/dashboard');
  } catch (error) {
    toast.error(error?.response?.data?.msg);

    return error;
  }
};
const Register = () => {
  return (
    <Wrapper>
      <Form method='post' className='form'>
        <Logo />
        <h4>Join My Job Tracker!</h4>
        <FormRow type='text' name='name' placeholder='Enter your first name' />
        <FormRow type='text' name='lastName' labelText='last name' placeholder='Enter your last name' />
        <FormRow type='text' name='location' placeholder='Your city or location' />
        <FormRow type='email' name='email' placeholder='your.email@example.com' />
        <FormRow type='password' name='password' placeholder='Create a strong password (min 8 chars)' />
        <SubmitBtn />
        
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)', 
          borderRadius: '12px',
          border: '2px solid var(--primary-300)',
          fontSize: '0.9rem',
          boxShadow: '0 4px 15px rgba(147, 51, 234, 0.1)'
        }}>
          <p style={{ marginTop: 0, color: 'var(--primary-700)' }}> <strong>Want to explore first?</strong></p>
          <p style={{ margin: '0.5rem 0', marginBottom: 0 }}>
            <Link to='/login' className='member-btn' style={{ color: 'var(--primary-500)', fontWeight: '600' }}>Try the demo account instead!</Link>
          </p>
        </div>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          Already have an account?
          <Link to='/login' className='member-btn' style={{ color: 'var(--primary-500)', fontWeight: '600' }}>
            Sign In Here
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};
export default Register;
