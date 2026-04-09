import { useState } from 'react';
import { Form, redirect, Link, useNavigate } from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { FormRow, Logo, SubmitBtn } from '../components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const isRegister = data.isRegister === 'true';

  try {
    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    const response = await customFetch.post(endpoint, data);
    const { token, user } = response.data;
    
    // Save token and user to localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    toast.success(isRegister ? 'Registration successful' : 'Login successful');
    return redirect('/dashboard');
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const RegisterAndLogin = () => {
  const [isRegister, setIsRegister] = useState(true);
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
        <h4>{isRegister ? 'Join My Job Tracker!' : 'Welcome Back!'}</h4>
        
        {isRegister && (
          <>
            <FormRow type='text' name='name' placeholder='Enter your first name' />
            <FormRow type='text' name='lastName' labelText='last name' placeholder='Enter your last name' />
            <FormRow type='text' name='location' placeholder='Your city or location' />
          </>
        )}
        
        <FormRow type='email' name='email' placeholder='your.email@example.com' />
        <FormRow type='password' name='password' placeholder={isRegister ? 'Create a strong password (min 8 chars)' : 'Enter your password'} />
        
        <input type='hidden' name='isRegister' value={isRegister} />
        
        <SubmitBtn />
        
        {!isRegister && (
          <button type='button' className='btn btn-block' onClick={loginDemoUser} style={{ backgroundColor: 'var(--primary-500)', color: 'white' }}>
            Quick Demo Login
          </button>
        )}

        {!isRegister && (
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
        )}

        {isRegister && (
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
              <button type='button' onClick={() => setIsRegister(false)} className='member-btn' style={{ color: 'var(--primary-500)', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>Try the demo account instead!</button>
            </p>
          </div>
        )}
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          {isRegister ? 'Already have an account?' : 'New here?'}
          <button type='button' onClick={() => setIsRegister(!isRegister)} className='member-btn' style={{ color: 'var(--primary-500)', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>
            {isRegister ? 'Sign In Here' : 'Create Your Account'}
          </button>
        </p>
      </Form>
    </Wrapper>
  );
};

export default RegisterAndLogin;