import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-indigo-800 mb-4">Welcome to <span className="text-yellow-500">DebtMate</span></h1>
        <p className="text-gray-600 mb-6">Track debts between friends & family, manage repayments, and stay financially organized.</p>
        <Link
          to="/add-loan"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;
