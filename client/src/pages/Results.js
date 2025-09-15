import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Trophy, 
  Download, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  Star,
  Award,
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';

const Results = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();

  const fetchResult = useCallback(async () => {
    try {
      // Since we don't have a specific endpoint to get result by ID,
      // we'll get all user results and find the one we need
      const response = await axios.get('/api/user/results');
      const foundResult = response.data.find(r => r._id === resultId);
      
      if (foundResult) {
        setResult(foundResult);
      } else {
        toast.error('Result not found');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching result:', error);
      toast.error('Failed to load result');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [resultId, navigate]);

  useEffect(() => {
    if (resultId) {
      fetchResult();
    }
  }, [resultId, fetchResult]);

  const handleDownloadCertificate = async () => {
    if (!result || !result.passed) {
      toast.error('Certificate can only be generated for passed quizzes');
      return;
    }

    setDownloading(true);
    
    try {
      const response = await axios.post('/api/certificate/generate', 
        { resultId: result._id },
        { responseType: 'blob' }
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${result.userId?.name || 'student'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      const errorMessage = error.response?.data?.message || 'Failed to download certificate';
      toast.error(errorMessage);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading results...</div>;
  }

  if (!result) {
    return (
      <div className="container">
        <div className="card text-center">
          <XCircle size={48} style={{ color: '#dc3545', marginBottom: '20px' }} />
          <h2>Result Not Found</h2>
          <p>The requested result could not be found.</p>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const percentage = result.score;
  const passed = result.passed;
  const date = new Date(result.createdAt).toLocaleDateString();
  const time = new Date(result.createdAt).toLocaleTimeString();

  return (
    <div className="container">
      {/* Header */}
      <div className="card text-center">
        <div style={{ marginBottom: '30px' }}>
          {passed ? (
            <div>
              <Trophy size={64} style={{ color: '#28a745', marginBottom: '20px' }} />
              <h1 style={{ fontSize: '36px', color: '#28a745', marginBottom: '10px' }}>
                Congratulations! 🎉
              </h1>
              <p style={{ fontSize: '20px', color: '#666' }}>
                You have successfully passed the quiz!
              </p>
            </div>
          ) : (
            <div>
              <XCircle size={64} style={{ color: '#dc3545', marginBottom: '20px' }} />
              <h1 style={{ fontSize: '36px', color: '#dc3545', marginBottom: '10px' }}>
                Quiz Completed
              </h1>
              <p style={{ fontSize: '20px', color: '#666' }}>
                Better luck next time! Keep learning and improving.
              </p>
            </div>
          )}
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '30px',
          flexWrap: 'wrap',
          marginBottom: '30px'
        }}>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn btn-secondary"
          >
            <ArrowLeft size={20} style={{ marginRight: '8px' }} />
            Back to Dashboard
          </button>
          
          <button 
            onClick={() => navigate('/quiz')} 
            className="btn btn-primary"
          >
            Take Quiz Again
          </button>
          
          {passed && (
            <button 
              onClick={handleDownloadCertificate}
              disabled={downloading}
              className="btn btn-success"
            >
              {downloading ? (
                'Generating...'
              ) : (
                <>
                  <Download size={20} style={{ marginRight: '8px' }} />
                  Download Certificate
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Score Details */}
      <div className="card">
        <h2 style={{ fontSize: '24px', marginBottom: '30px', color: '#333', textAlign: 'center' }}>
          Quiz Results
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ 
            textAlign: 'center', 
            padding: '25px', 
            background: passed ? '#d4edda' : '#f8d7da',
            borderRadius: '15px',
            border: `2px solid ${passed ? '#28a745' : '#dc3545'}`
          }}>
            <div style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              color: passed ? '#28a745' : '#dc3545',
              marginBottom: '10px'
            }}>
              {percentage}%
            </div>
            <div style={{ 
              color: passed ? '#155724' : '#721c24',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Final Score
            </div>
          </div>

          <div style={{ 
            textAlign: 'center', 
            padding: '25px', 
            background: '#f8f9ff',
            borderRadius: '15px',
            border: '2px solid #667eea'
          }}>
            <div style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              color: '#667eea',
              marginBottom: '10px'
            }}>
              {result.correctAnswers || Math.round((percentage / 100) * result.totalQuestions)}
            </div>
            <div style={{ 
              color: '#333',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Correct Answers
            </div>
          </div>

          <div style={{ 
            textAlign: 'center', 
            padding: '25px', 
            background: '#f8f9ff',
            borderRadius: '15px',
            border: '2px solid #667eea'
          }}>
            <div style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              color: '#667eea',
              marginBottom: '10px'
            }}>
              {result.totalQuestions}
            </div>
            <div style={{ 
              color: '#333',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Total Questions
            </div>
          </div>

          <div style={{ 
            textAlign: 'center', 
            padding: '25px', 
            background: passed ? '#d4edda' : '#f8d7da',
            borderRadius: '15px',
            border: `2px solid ${passed ? '#28a745' : '#dc3545'}`
          }}>
            <div style={{ 
              fontSize: '32px', 
              marginBottom: '10px'
            }}>
              {passed ? <CheckCircle size={48} color="#28a745" /> : <XCircle size={48} color="#dc3545" />}
            </div>
            <div style={{ 
              color: passed ? '#155724' : '#721c24',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              {passed ? 'PASSED' : 'FAILED'}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginTop: '30px'
        }}>
          <div style={{ 
            padding: '20px', 
            background: '#f8f9fa',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <Calendar size={24} style={{ color: '#667eea', marginBottom: '10px' }} />
            <div style={{ fontWeight: '600', marginBottom: '5px' }}>Date</div>
            <div style={{ color: '#666' }}>{date}</div>
          </div>

          <div style={{ 
            padding: '20px', 
            background: '#f8f9fa',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <Clock size={24} style={{ color: '#667eea', marginBottom: '10px' }} />
            <div style={{ fontWeight: '600', marginBottom: '5px' }}>Time</div>
            <div style={{ color: '#666' }}>{time}</div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="card">
        <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#333' }}>
          <TrendingUp size={20} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
          Performance Insights
        </h3>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px'
        }}>
          <div style={{ textAlign: 'center', padding: '20px', background: '#fff3cd', borderRadius: '10px' }}>
            <Star size={32} style={{ color: '#ffc107', marginBottom: '10px' }} />
            <div style={{ fontWeight: '600', marginBottom: '5px' }}>Passing Score</div>
            <div style={{ color: '#856404', fontSize: '18px', fontWeight: 'bold' }}>70%</div>
          </div>

          <div style={{ textAlign: 'center', padding: '20px', background: passed ? '#d4edda' : '#f8d7da', borderRadius: '10px' }}>
            <Award size={32} style={{ color: passed ? '#28a745' : '#dc3545', marginBottom: '10px' }} />
            <div style={{ fontWeight: '600', marginBottom: '5px' }}>Your Performance</div>
            <div style={{ 
              color: passed ? '#155724' : '#721c24', 
              fontSize: '18px', 
              fontWeight: 'bold' 
            }}>
              {percentage >= 90 ? 'Excellent' : 
               percentage >= 80 ? 'Very Good' : 
               percentage >= 70 ? 'Good' : 'Needs Improvement'}
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9ff', borderRadius: '10px' }}>
            <TrendingUp size={32} style={{ color: '#667eea', marginBottom: '10px' }} />
            <div style={{ fontWeight: '600', marginBottom: '5px' }}>Improvement</div>
            <div style={{ color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
              {percentage < 70 ? `${70 - percentage}% more needed` : 'Target achieved!'}
            </div>
          </div>
        </div>

        {passed && (
          <div style={{ 
            marginTop: '20px', 
            padding: '20px', 
            background: '#d1ecf1',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <Award size={24} style={{ color: '#0c5460', marginBottom: '10px' }} />
            <div style={{ color: '#0c5460', fontWeight: '600' }}>
              🎉 Congratulations! You've earned a certificate for your achievement!
            </div>
            <div style={{ color: '#0c5460', fontSize: '14px', marginTop: '5px' }}>
              Click the "Download Certificate" button above to get your personalized certificate.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
