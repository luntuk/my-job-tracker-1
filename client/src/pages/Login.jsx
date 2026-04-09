import { Link, Form, redirect, useNavigate } from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { FormRow, Logo, SubmitBtn } from '../components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
      const response = await customFetch.post('/auth/login', data);
      const { token, user } = response.data;
      
      // Save token and user to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      queryClient.invalidateQueries();
      toast.success('Login successful');
      return redirect('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return error;
    }
  };

const Login = () => {
  const navigate = useNavigate();

  const loginDemoUser = async () => {
    const data = {
      email: 'demo@example.com',
      password: 'demo123456',
    };
    try {
      const response = await customFetch.post('/auth/login', data);
      const { token, user } = response.data;
      
      // Save token and user to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success('✨ Welcome to demo account!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.msg);
    }
  };
  return (
    <Wrapper>
      <Form method='post' className='form'>
        <Logo />
        <h4>Welcome Back!</h4>
        <FormRow type='email' name='email' placeholder='Enter your email' />
        <FormRow type='password' name='password' placeholder='Enter your password' />
        <SubmitBtn />
        
        <button type='button' className='btn btn-block' onClick={loginDemoUser} style={{ backgroundColor: 'var(--primary-500)', color: 'white' }}>
          Quick Demo Login
        </button>

        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%)', 
          borderRadius: '12px',
          border: '2px solid var(--primary-300)',
          boxShadow: '0 4px 15px rgba(147, 51, 234, 0.1)'
        }}>
          <h5 style={{ marginTop: 0, color: 'var(--primary-700)' }}>Demo Account Info</h5>
          <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
            <strong>Email:</strong> demo@example.com
          </p>
          <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
            <strong>Password:</strong> demo123456
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--grey-600)', margin: '0.5rem 0 0 0' }}>
            Perfect for testing the app! No real data required.
          </p>
        </div>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          New here? 
          <Link to='/register' className='member-btn' style={{ color: 'var(--primary-500)', fontWeight: '600' }}>
            Create Your Account
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};
export default Login;
