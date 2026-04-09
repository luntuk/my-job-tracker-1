import styled from 'styled-components';
import Wrapper from '../assets/wrappers/LandingPage';
import { Link } from 'react-router-dom';
import { Logo } from '../components';

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className='container page'>
        <div className='info'>
          <h1>
            Welcome to My Job Tracker!
          </h1>
          <p>
            Whether you're just starting your career or looking for your next big opportunity, this app will help you stay organized.
            Add jobs, track their status, and never miss an opportunity again!
          </p>
          
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to='/register' className='btn register-link'>
              Sign Up
            </Link>
            <Link to='/login' className='btn'>
              Try Demo Account
            </Link>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '2px solid var(--primary-200)' }}>
            <h3 style={{ color: 'var(--primary-600)' }}>Quick Demo Access:</h3>
            <p><strong>Email:</strong> demo@example.com</p>
            <p><strong>Password:</strong> demo123456</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--grey-600)', marginTop: '0.5rem' }}>
              Click "Try Demo Account" above or use these credentials to log in!
            </p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Landing;
