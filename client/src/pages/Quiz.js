import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/quiz/questions');
      setQuestions(response.data);
      setAnswers(new Array(response.data.length).fill(''));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load quiz questions');
      setLoading(false);
    }
  };

  const handleSubmitQuiz = useCallback(async () => {
    if (submitting) return;

    const answeredQuestions = answers.filter(answer => answer !== '').length;
    if (answeredQuestions === 0) {
      toast.error('Please answer at least one question before submitting');
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await axios.post('/api/quiz/submit', { answers });
      const { resultId } = response.data;
      
      toast.success('Quiz submitted successfully!');
      navigate(`/results/${resultId}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  }, [answers, submitting, navigate]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1] || '');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1] || '');
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft, handleSubmitQuiz]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="loading">Loading quiz questions...</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="container">
        <div className="card text-center">
          <AlertCircle size={48} style={{ color: '#dc3545', marginBottom: '20px' }} />
          <h2>No Questions Available</h2>
          <p>The quiz is not available at the moment. Please try again later.</p>
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

  const currentQuestion = questions[currentQuestionIndex];
  const answeredQuestions = answers.filter(answer => answer !== '').length;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="container">
      {/* Header */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }} className="quiz-header">
          <div>
            <h1 style={{ fontSize: '24px', marginBottom: '5px', color: '#333' }}>
              LMS Certification Quiz
            </h1>
            <p style={{ color: '#666', margin: 0 }}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px 16px',
              background: timeLeft < 300 ? '#f8d7da' : '#f8f9ff',
              borderRadius: '20px',
              color: timeLeft < 300 ? '#721c24' : '#667eea'
            }}>
              <Clock size={20} />
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                {formatTime(timeLeft)}
              </span>
            </div>
            
            <div style={{ 
              padding: '8px 16px',
              background: '#d4edda',
              borderRadius: '20px',
              color: '#155724',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {answeredQuestions}/{questions.length} answered
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress" style={{ marginTop: '20px' }}>
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          >
            {Math.round(progress)}%
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="card">
        <h2 style={{ 
          fontSize: '20px', 
          marginBottom: '30px', 
          color: '#333',
          lineHeight: '1.5'
        }}>
          {currentQuestion.questionText}
        </h2>

        <div style={{ marginBottom: '30px' }}>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`quiz-option ${selectedAnswer === option ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="btn btn-secondary"
            style={{ 
              opacity: currentQuestionIndex === 0 ? 0.5 : 1,
              cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <ArrowLeft size={20} style={{ marginRight: '8px' }} />
            Previous
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                  setSelectedAnswer(answers[index] || '');
                }}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '2px solid',
                  background: index === currentQuestionIndex 
                    ? '#667eea' 
                    : answers[index] 
                      ? '#28a745' 
                      : 'white',
                  color: index === currentQuestionIndex 
                    ? 'white' 
                    : answers[index] 
                      ? 'white' 
                      : '#667eea',
                  borderColor: index === currentQuestionIndex 
                    ? '#667eea' 
                    : answers[index] 
                      ? '#28a745' 
                      : '#e1e5e9',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="btn btn-success"
            >
              {submitting ? (
                'Submitting...'
              ) : (
                <>
                  <CheckCircle size={20} style={{ marginRight: '8px' }} />
                  Submit Quiz
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn btn-primary"
            >
              Next
              <ArrowRight size={20} style={{ marginLeft: '8px' }} />
            </button>
          )}
        </div>
      </div>

      {/* Warning for unanswered questions */}
      {answeredQuestions < questions.length && (
        <div className="card" style={{ background: '#fff3cd', border: '1px solid #ffeaa7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} style={{ color: '#856404' }} />
            <span style={{ color: '#856404', fontWeight: '600' }}>
              You have {questions.length - answeredQuestions} unanswered questions
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
