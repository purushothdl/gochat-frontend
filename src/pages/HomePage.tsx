// src/pages/HomePage.tsx
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold">Welcome to the Chat App</h1>
      <p className="mt-4 text-lg">
        Please <Link to="/login" className="text-indigo-600 hover:underline">login</Link> or{' '}
        <Link to="/register" className="text-indigo-600 hover:underline">register</Link> to continue.
      </p>
    </div>
  );
};

export default HomePage;