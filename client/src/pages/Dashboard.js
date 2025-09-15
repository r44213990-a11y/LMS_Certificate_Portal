import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BookOpen, Trophy, Clock, Play, History } from 'lucide-react';

const Dashboard = () => {
  const [quiz, setQuiz] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [quizResponse, resultsResponse] = await Promise.all([
        axios.get('/api/quiz'),
        axios.get('/api/user/results')
      ]);

      setQuiz(quizResponse.data);
      setResults(resultsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    navigate('/quiz');
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const totalAttempts = results.length;
  const passedAttempts = results.filter(r => r.passed).length;
  const averageScore = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
    : 0;

  return (
    <div className="container">
      <div className="text-center mb-4">
        <h1 style={{ fontSize: '32px', marginBottom: '10px', color: '#333' }}>
          Welcome back, {user?.name || 'Student'}! 👋
        </h1>
        <p style={{ color: '#666', fontSize: '18px' }}>
          Ready to test your knowledge and earn certificates?
        </p>
      </div>

      {/* Quiz Card */}
      {quiz && (
        <div className="card">
          <div className="card-header">
            <BookOpen size={32} style={{ color: 'var(--primary-color)' }} />
            <div>
              <h2 className="card-title">
                {quiz.title}
              </h2>
              <p className="card-subtitle">
                {quiz.description || 'Test your knowledge with this comprehensive quiz'}
              </p>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px',
            marginBottom: '30px'
          }} className="grid-responsive">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                {quiz.timeLimit}
              </div>
              <div style={{ color: '#666' }}>
                <Clock size={16} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                Minutes
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                {quiz.passingScore}%
              </div>
              <div style={{ color: '#666' }}>
                <Trophy size={16} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                Pass Score
              </div>
            </div>
          </div>

          <button 
            onClick={startQuiz} 
            className="btn btn-primary"
            style={{ width: '100%', fontSize: '18px', padding: '15px' }}
          >
            <Play size={20} style={{ marginRight: '10px' }} />
            Start Quiz
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="card">
        <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#333' }}>
          <History size={20} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
          Your Statistics
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '20px'
        }}>
          <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9ff', borderRadius: '10px' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea' }}>
              {totalAttempts}
            </div>
            <div style={{ color: '#666' }}>Total Attempts</div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9ff', borderRadius: '10px' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745' }}>
              {passedAttempts}
            </div>
            <div style={{ color: '#666' }}>Passed</div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9ff', borderRadius: '10px' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffc107' }}>
              {averageScore}%
            </div>
            <div style={{ color: '#666' }}>Average Score</div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9ff', borderRadius: '10px' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc3545' }}>
              {totalAttempts > 0 ? Math.round((totalAttempts - passedAttempts) / totalAttempts * 100) : 0}%
            </div>
            <div style={{ color: '#666' }}>Failed Rate</div>
          </div>
        </div>
      </div>

      {/* Recent Results */}
      {results.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#333' }}>
            Recent Results
          </h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    Date
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    Score
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    Status
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.slice(0, 5).map((result, index) => (
                  <tr key={result._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>
                      {new Date(result.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>
                      {result.score}%
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span 
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          background: result.passed ? '#d4edda' : '#f8d7da',
                          color: result.passed ? '#155724' : '#721c24'
                        }}
                      >
                        {result.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button
                        onClick={() => navigate(`/results/${result._id}`)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
