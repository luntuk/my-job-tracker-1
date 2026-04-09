import styled from 'styled-components';

const Wrapper = styled.section`
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
  min-height: 100vh;
  
  nav {
    width: var(--fluid-width);
    max-width: var(--max-width);
    margin: 0 auto;
    height: var(--nav-height);
    display: flex;
    align-items: center;
  }
  
  .page {
    min-height: calc(100vh - var(--nav-height));
    display: grid;
    align-items: center;
    margin-top: -3rem;
  }
  
  h1 {
    font-weight: 700;
    color: var(--primary-700);
    margin-bottom: 1.5rem;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  p {
    line-height: 1.8;
    color: var(--text-secondary-color);
    margin-bottom: 1.5rem;
    max-width: 35em;
    font-size: 1.1rem;
  }
  
  .register-link {
    margin-right: 1rem;
  }
  
  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(147, 51, 234, 0.2);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(147, 51, 234, 0.3);
    }
  }
  
  .main-img {
    display: none;
  }
  
  @media (min-width: 992px) {
    .page {
      grid-template-columns: 1fr 400px;
      column-gap: 3rem;
    }
    .main-img {
      display: block;
    }
  }
`;
export default Wrapper;
