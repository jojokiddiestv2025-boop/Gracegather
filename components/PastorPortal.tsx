import React, { useState, useEffect } from 'react';
import { Shield, User as UserIcon, MessageCircleHeart, Lock, Send, Loader2, CheckCircle, X, ChevronLeft, Briefcase, Video, FileText, Users, LogOut, AlertCircle, UserPlus, Clock, Calendar, Radio, StopCircle, BookOpen, GraduationCap, ChevronRight, Trash2, Heart } from 'lucide-react';
import { AuthService } from '../services/authService';
import { ScheduleService } from '../services/scheduleService';
import { PrayerService } from '../services/prayerService';
import { User, UserRole, StreamEvent, PrayerRequest } from '../types';

type PortalView = 'landing' | 'login' | 'dashboard' | 'applications-list' | 'prayer-list' | 'schedule-manager' | 'test';

const PastorPortal: React.FC = () => {
  const [view, setView] = useState<PortalView>('landing');
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  
  // Login Form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Register Form
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [ministryCode, setMinistryCode] = useState('');

  // Schedule Form
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDate, setStreamDate] = useState('');
  const [streamTime, setStreamTime] = useState('');
  const [streamDesc, setStreamDesc] = useState('');
  const [scheduledEvents, setScheduledEvents] = useState<StreamEvent[]>([]);

  // Prayer List State
  const [communityPrayers, setCommunityPrayers] = useState<PrayerRequest[]>([]);

  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // Dashboard State
  const [generatedMeetingId, setGeneratedMeetingId] = useState('');
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);

  // Test State
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [testPassed, setTestPassed] = useState(false);

  const PASTOR_TEST_QUESTIONS = [
    {
      question: "What is the primary mission of the Church according to Matthew 28:19?",
      options: ["To accumulate wealth", "To make disciples of all nations", "To gain political influence", "To isolate from the world"],
      correct: 1
    },
    {
      question: "Which of these is NOT a Fruit of the Spirit (Galatians 5:22-23)?",
      options: ["Patience", "Kindness", "Ambition", "Self-control"],
      correct: 2
    },
    {
      question: "According to Ephesians 2:8, how are we saved?",
      options: ["By our good deeds", "By regular church attendance", "By grace through faith", "By obeying the law perfectly"],
      correct: 2
    },
    {
      question: "Who is the head of the Church?",
      options: ["The Senior Pastor", "The Pope", "Jesus Christ", "The Board of Elders"],
      correct: 2
    },
    {
      question: "What is the greatest commandment according to Jesus?",
      options: ["Love the Lord your God with all your heart", "Do not steal", "Pay your tithes", "Observe the Sabbath"],
      correct: 0
    }
  ];

  // --- Effects ---
  
  // Check session on mount
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setView('dashboard');
    }
  }, []);

  useEffect(() => {
    if (view === 'applications-list' && user?.role === UserRole.ADMIN) {
      loadPendingUsers();
    }
    if (view === 'schedule-manager') {
      loadSchedule();
    }
    if (view === 'prayer-list') {
      loadPrayers();
    }
  }, [view, user]);

  // --- Handlers ---

  const loadPendingUsers = async () => {
    const users = await AuthService.getPendingUsers();
    setPendingUsers(users);
  };

  const loadSchedule = () => {
    setScheduledEvents(ScheduleService.getEvents());
  };

  const loadPrayers = () => {
    setCommunityPrayers(PrayerService.getRequests());
  };

  const handleDeletePrayer = (id: string) => {
    if(confirm('Delete this prayer request?')) {
        PrayerService.deleteRequest(id);
        loadPrayers();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    
    try {
      const loggedInUser = await AuthService.login(username, password);
      setUser(loggedInUser);
      setView('dashboard');
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setAuthError(err.message || 'Access Denied');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');

    try {
      await AuthService.register(regUsername, regPassword, regName, ministryCode);
      setRegSuccess(true);
      // Don't auto-login.
      setRegName(''); setRegUsername(''); setRegPassword(''); setMinistryCode('');
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await AuthService.logout();
    setUser(null);
    setView('landing');
    setLoading(false);
  };

  const createMeeting = () => {
    const id = "FELLOWSHIP-" + Math.floor(Math.random() * 10000);
    setGeneratedMeetingId(id);
  };

  const handleApproveUser = async (username: string) => {
     await AuthService.approveUser(username);
     loadPendingUsers(); // Refresh list
  };

  const handleRejectUser = async (username: string) => {
     await AuthService.rejectUser(username);
     loadPendingUsers(); // Refresh list
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const dateTime = `${streamDate}T${streamTime}`;
    // Default to BROADCAST for Pastor Portal scheduler
    ScheduleService.addEvent(streamTitle, dateTime, streamDesc, 'BROADCAST', user?.name || 'Sanctuary');
    loadSchedule();
    setStreamTitle(''); setStreamDate(''); setStreamTime(''); setStreamDesc('');
  };

  const handleDeleteSchedule = (id: string) => {
    if(confirm('Are you sure you want to cancel this scheduled stream? This cannot be undone.')) {
      ScheduleService.deleteEvent(id);
      loadSchedule();
    }
  };

  const handleEndStream = (id: string) => {
    if(confirm('Are you sure you want to end the current live broadcast?')) {
      ScheduleService.setLiveStatus(id, false);
      loadSchedule();
    }
  };

  const handleGoLive = (id: string) => {
    ScheduleService.setLiveStatus(id, true);
    // Redirect to conference room with ID
    const event = scheduledEvents.find(e => e.id === id);
    if (event) {
        window.location.hash = `/conference?id=${event.id}`;
    }
  };

  // --- Test Handlers ---
  const handleStartTest = () => {
    setView('test');
    setQuizScore(0);
    setCurrentQuestion(0);
    setShowQuizResult(false);
    setTestPassed(false);
  };

  const handleAnswer = (optionIndex: number) => {
    let newScore = quizScore;
    if (optionIndex === PASTOR_TEST_QUESTIONS[currentQuestion].correct) {
        newScore = quizScore + 1;
        setQuizScore(newScore);
    }
    
    if (currentQuestion + 1 < PASTOR_TEST_QUESTIONS.length) {
        setCurrentQuestion(prev => prev + 1);
    } else {
        // Finish Test
        const passed = newScore >= 4; // Need 4 out of 5 to pass
        setTestPassed(passed);
        setShowQuizResult(true);
    }
  };

  const handleProceedToRegistration = () => {
    setIsRegistering(true);
    setMinistryCode('GRACE'); // Auto-fill code if passed
    setView('login');
  };

  // --- Renders ---

  const renderLanding = () => (
    <div className="max-w-4xl mx-auto pt-10 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-display font-bold text-church-900 mb-4">Pastoral Care Portal</h1>
        <p className="text-xl text-gray-600">Connect with spiritual leadership or serve the community.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Seeker Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-gold-500 hover:shadow-2xl transition-all group">
          <div className="p-8">
            <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageCircleHeart className="w-8 h-8 text-gold-600" />
            </div>
            <h2 className="text-2xl font-bold text-church-900 mb-3">Need Prayer?</h2>
            <p className="text-gray-600 mb-8">
              Visit our new Community Prayer Wall to share your requests and pray for others.
            </p>
            <button 
              onClick={() => window.location.hash = '/prayer-wall'}
              className="w-full py-4 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center"
            >
              Go to Prayer Wall <Send className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Pastor Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-church-600 hover:shadow-2xl transition-all group">
          <div className="p-8">
            <div className="w-16 h-16 bg-church-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Briefcase className="w-8 h-8 text-church-600" />
            </div>
            <h2 className="text-2xl font-bold text-church-900 mb-3">Ministry Leadership</h2>
            <p className="text-gray-600 mb-8">
              Secure area for pastors and admins to manage ministry, meetings, and applications.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setView('login')}
                className="w-full py-4 bg-church-600 hover:bg-church-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center"
              >
                <Lock className="w-4 h-4 mr-2" />
                Secure Login
              </button>
              <button 
                onClick={handleStartTest}
                className="w-full py-3 bg-church-50 text-church-700 border border-church-200 font-bold rounded-xl hover:bg-church-100 transition-colors flex items-center justify-center text-sm"
              >
                <GraduationCap className="w-4 h-4 mr-2" /> Take Pastoral Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTest = () => (
    <div className="max-w-2xl mx-auto pt-10 px-4">
       <button onClick={() => setView('landing')} className="flex items-center text-gray-500 hover:text-church-600 mb-6">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-church-600">
        <div className="mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-3xl font-bold text-church-900">Pastoral Eligibility Test</h2>
            <p className="text-gray-600 mt-2">Demonstrate your biblical knowledge to qualify for registration.</p>
        </div>

        {!showQuizResult ? (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Question {currentQuestion + 1} of {PASTOR_TEST_QUESTIONS.length}</span>
                    <span className="text-xs bg-church-100 text-church-700 px-2 py-1 rounded-full">{Math.round(((currentQuestion) / PASTOR_TEST_QUESTIONS.length) * 100)}% Complete</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-6">{PASTOR_TEST_QUESTIONS[currentQuestion].question}</h3>
                
                <div className="space-y-3">
                    {PASTOR_TEST_QUESTIONS[currentQuestion].options.map((option, idx) => (
                        <button 
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-church-500 hover:bg-church-50 transition-all font-medium text-gray-700"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        ) : (
            <div className="text-center py-8 animate-fade-in">
                {testPassed ? (
                    <>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-church-900 mb-2">Assessment Passed!</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Congratulations. You have demonstrated the knowledge required to join the pastoral leadership team.
                        </p>
                        <button 
                            onClick={handleProceedToRegistration}
                            className="px-8 py-4 bg-church-600 text-white font-bold rounded-xl hover:bg-church-700 shadow-lg flex items-center justify-center mx-auto"
                        >
                            Proceed to Registration <ChevronRight className="w-5 h-5 ml-2" />
                        </button>
                    </>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <X className="w-10 h-10 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-church-900 mb-2">Assessment Failed</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Unfortunately, you did not answer enough questions correctly. We encourage you to study the scriptures and try again later.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button 
                                onClick={handleStartTest}
                                className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200"
                            >
                                Try Again
                            </button>
                            <button 
                                onClick={() => setView('landing')}
                                className="px-6 py-3 border border-gray-300 text-gray-600 font-bold rounded-lg hover:bg-gray-50"
                            >
                                Return Home
                            </button>
                        </div>
                    </>
                )}
            </div>
        )}
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="max-w-md mx-auto pt-10 px-4">
      <button onClick={() => setView('landing')} className="flex items-center text-gray-500 hover:text-church-600 mb-6">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back
      </button>
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex flex-col items-center mb-6">
           <div className="p-4 bg-church-100 rounded-full mb-4">
             <Shield className="w-8 h-8 text-church-700" />
           </div>
           <h2 className="text-2xl font-bold text-center text-church-900">
             {isRegistering ? 'Create Account' : 'Secure Access'}
           </h2>
           <p className="text-sm text-gray-500 mt-1">Authorized Personnel Only</p>
        </div>
        
        {regSuccess ? (
           <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-church-900 mb-2">Registration Submitted</h3>
              <p className="text-gray-600 mb-6">Your account has been created and is awaiting approval from the Super Admin.</p>
              <button 
                onClick={() => {setRegSuccess(false); setIsRegistering(false);}} 
                className="px-6 py-2 bg-church-600 text-white font-bold rounded-lg hover:bg-church-700"
              >
                Return to Login
              </button>
           </div>
        ) : isRegistering ? (
          /* Registration Form */
          <form onSubmit={handleRegister} className="space-y-4">
             {testPassed && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700 text-sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Test Passed. Ministry Code Auto-filled.
                </div>
             )}
             <div>
              <label className="block text-xs font-bold text-church-600 uppercase tracking-wider mb-1">Full Name</label>
              <input 
                type="text" 
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-500 outline-none"
                placeholder="Pastor John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-church-600 uppercase tracking-wider mb-1">New Username</label>
              <input 
                type="text" 
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-500 outline-none"
                placeholder="john.doe"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-church-600 uppercase tracking-wider mb-1">Password</label>
              <input 
                type="password" 
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gold-600 uppercase tracking-wider mb-1">Ministry Code</label>
              <input 
                type="password" 
                value={ministryCode}
                onChange={(e) => setMinistryCode(e.target.value)}
                className="w-full px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                placeholder="Required for registration"
                required
                readOnly={testPassed} // Lock it if auto-filled from test
              />
            </div>
            {authError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center text-red-600 text-sm">
                 <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                 {authError}
              </div>
            )}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-church-800 hover:bg-church-900 text-white font-bold rounded-lg transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register for Approval'}
            </button>
            <div className="text-center pt-2">
               <button type="button" onClick={() => {setIsRegistering(false); setAuthError('');}} className="text-sm text-church-600 hover:underline">
                 Already have an account? Login
               </button>
            </div>
          </form>
        ) : (
          /* Login Form */
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-church-600 uppercase tracking-wider mb-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-500 focus:bg-white outline-none transition-all"
                placeholder="e.g. pastor"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-church-600 uppercase tracking-wider mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-500 focus:bg-white outline-none transition-all"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            
            {authError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center text-red-600 text-sm">
                 <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                 {authError}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-church-800 hover:bg-church-900 text-white font-bold rounded-lg transition-colors shadow-lg flex items-center justify-center disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authenticate'}
            </button>
            
            <div className="text-center border-t border-gray-100 pt-4">
               <p className="text-xs text-gray-500 mb-2">New to the pastoral team?</p>
               <button 
                 type="button" 
                 onClick={() => {setIsRegistering(true); setAuthError('');}} 
                 className="flex items-center justify-center w-full py-2 bg-white border border-church-200 text-church-700 font-bold rounded-lg hover:bg-gray-50 transition-colors text-sm"
               >
                 <UserPlus className="w-4 h-4 mr-2" /> Register New Account
               </button>
            </div>
          </form>
        )}
        
        <div className="mt-6 text-center text-xs text-gray-400">
          Protected by GraceGuard™ Security
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="max-w-6xl mx-auto pt-8 px-4">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-12 h-12 bg-church-100 rounded-full flex items-center justify-center mr-4">
             <UserIcon className="w-6 h-6 text-church-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-church-900">{user?.name}</h1>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${user?.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {user?.role}
              </span>
              <span className="text-xs text-green-600 flex items-center"><div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div> Live Session</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Username: {user?.username}
            </div>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          disabled={loading}
          className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium flex items-center transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" /> Log Out
        </button>
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
         <div onClick={() => createMeeting()} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 cursor-pointer hover:bg-blue-50 transition-colors group">
            <Video className="w-8 h-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-gray-800 text-lg font-bold">Create Meeting</h3>
            <p className="text-sm text-gray-500">Start a live fellowship session.</p>
         </div>
         
         {user?.role === UserRole.ADMIN && (
            <div onClick={() => setView('schedule-manager')} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500 cursor-pointer hover:bg-red-50 transition-colors group">
                <Radio className="w-8 h-8 text-red-500 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="text-gray-800 text-lg font-bold">Live Stream</h3>
                <p className="text-sm text-gray-500">Manage broadcasts schedule.</p>
            </div>
         )}

         {user?.role === UserRole.ADMIN && (
             <div onClick={() => setView('applications-list')} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-gold-500 cursor-pointer hover:bg-yellow-50 transition-colors group">
                <Users className="w-8 h-8 text-gold-500 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="text-gray-800 text-lg font-bold">Pending Approvals</h3>
                <p className="text-sm text-gray-500">Approve new pastor accounts.</p>
                {pendingUsers.length > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
                        {pendingUsers.length}
                    </div>
                )}
             </div>
         )}

         <div onClick={() => setView('prayer-list')} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 cursor-pointer hover:bg-purple-50 transition-colors group">
            <FileText className="w-8 h-8 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-gray-800 text-lg font-bold">Prayer Requests</h3>
            <p className="text-sm text-gray-500">See requests from the community.</p>
         </div>
      </div>

      {/* Meeting Generator Result */}
      {generatedMeetingId && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between animate-fade-in">
            <div>
                <h4 className="text-lg font-bold text-blue-900">Meeting Created!</h4>
                <p className="text-blue-700">Share this code with your congregation: <span className="font-mono font-bold text-xl bg-white px-2 py-1 rounded ml-2 shadow-sm border border-blue-100">{generatedMeetingId}</span></p>
            </div>
            <a href="#/conference" className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                Go to Conference Room
            </a>
        </div>
      )}

      {/* Lists */}
      {view === 'schedule-manager' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden animate-fade-in border border-gray-100 mb-8">
            <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex justify-between items-center">
              <h3 className="font-bold text-red-900 flex items-center"><Radio className="w-4 h-4 mr-2"/> Official Live Stream Manager</h3>
              <button onClick={() => setView('dashboard')} className="text-sm text-red-700 hover:underline">Close</button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
                {/* Add Event Form */}
                <div className="lg:col-span-1 bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center"><Calendar className="w-4 h-4 mr-2"/> Schedule New Broadcast</h4>
                    <form onSubmit={handleAddSchedule} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Topic / Title</label>
                            <input 
                                required
                                value={streamTitle}
                                onChange={e => setStreamTitle(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="Sunday Service"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                                <input 
                                    type="date"
                                    required
                                    value={streamDate}
                                    onChange={e => setStreamDate(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Time</label>
                                <input 
                                    type="time"
                                    required
                                    value={streamTime}
                                    onChange={e => setStreamTime(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                />
                             </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                            <textarea 
                                value={streamDesc}
                                onChange={e => setStreamDesc(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="Join us for worship..."
                                rows={3}
                            />
                        </div>
                        <button type="submit" className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors">
                            Schedule Stream
                        </button>
                    </form>
                </div>

                {/* Event List */}
                <div className="lg:col-span-2">
                    <h4 className="font-bold text-gray-800 mb-4">Upcoming Schedule</h4>
                    {scheduledEvents.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            No upcoming streams scheduled.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {scheduledEvents.map(event => (
                                <div key={event.id} className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-center ${event.isLive ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-white border-gray-200'}`}>
                                    <div className="mb-4 sm:mb-0">
                                        <div className="flex items-center">
                                            <h5 className="font-bold text-lg text-gray-900">{event.title}</h5>
                                            {event.isLive && <span className="ml-3 px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded uppercase animate-pulse">Live Now</span>}
                                        </div>
                                        <div className="text-sm text-gray-600 flex items-center mt-1">
                                            <Calendar className="w-3 h-3 mr-1"/> 
                                            {new Date(event.dateTime).toLocaleDateString()} at {new Date(event.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2 max-w-md">{event.description}</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        {!event.isLive ? (
                                            <>
                                                <button 
                                                    onClick={() => handleGoLive(event.id)}
                                                    className="px-4 py-2 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 flex items-center justify-center whitespace-nowrap"
                                                >
                                                    <Radio className="w-4 h-4 mr-2" /> GO LIVE
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteSchedule(event.id)}
                                                    className="px-4 py-2 border border-gray-300 text-gray-600 font-bold rounded-lg hover:bg-gray-100 flex items-center justify-center whitespace-nowrap transition-colors"
                                                    title="Cancel Event"
                                                >
                                                    <X className="w-4 h-4 mr-2" /> Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={() => handleGoLive(event.id)} // Re-enter
                                                    className="px-4 py-2 bg-green-100 text-green-700 font-bold rounded-lg hover:bg-green-200 flex items-center justify-center whitespace-nowrap"
                                                >
                                                    Resume
                                                </button>
                                                <button 
                                                    onClick={() => handleEndStream(event.id)}
                                                    className="px-4 py-2 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 flex items-center justify-center whitespace-nowrap"
                                                >
                                                    <StopCircle className="w-4 h-4 mr-2" /> End Stream
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {view === 'applications-list' && user?.role === UserRole.ADMIN && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden animate-fade-in border border-gray-100">
           <div className="bg-church-50 px-6 py-4 border-b border-church-100 flex justify-between items-center">
              <h3 className="font-bold text-church-800">Pending Pastor Approvals</h3>
              <button onClick={() => setView('dashboard')} className="text-sm text-church-600 hover:underline">Close</button>
           </div>
           
           {pendingUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No pending account approvals.</div>
           ) : (
              <ul className="divide-y divide-gray-100">
                  {pendingUsers.map(pUser => (
                      <li key={pUser.username} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                              <div>
                                  <div className="font-bold text-lg text-gray-800">{pUser.name}</div>
                                  <div className="text-sm text-gray-500">Username: {pUser.username}</div>
                                  <div className="text-xs text-orange-500 bg-orange-100 inline-block px-2 py-1 rounded mt-2">Awaiting Approval</div>
                              </div>
                              <div className="flex space-x-2 mt-4 md:mt-0">
                                  <button 
                                      onClick={() => handleApproveUser(pUser.username)}
                                      className="px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700"
                                  >
                                      Approve Access
                                  </button>
                                  <button 
                                      onClick={() => handleRejectUser(pUser.username)}
                                      className="px-4 py-2 bg-red-100 text-red-600 font-bold rounded hover:bg-red-200"
                                  >
                                      Reject
                                  </button>
                              </div>
                          </div>
                      </li>
                  ))}
              </ul>
           )}
        </div>
      )}

      {view === 'prayer-list' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden animate-fade-in border border-gray-100">
           <div className="bg-church-50 px-6 py-4 border-b border-church-100 flex justify-between items-center">
              <h3 className="font-bold text-church-800">Community Prayer Requests</h3>
              <button onClick={() => setView('dashboard')} className="text-sm text-church-600 hover:underline">Close</button>
           </div>
           
           {communityPrayers.length === 0 ? (
               <div className="p-8 text-center text-gray-500 italic">No community prayer requests yet.</div>
           ) : (
               <ul className="divide-y divide-gray-100">
                 {communityPrayers.map(req => (
                   <li key={req.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                          <div>
                              <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 text-purple-600">
                                   <MessageCircleHeart className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-gray-800">{req.author}</span>
                                <span className="text-xs text-gray-400 ml-3">{new Date(req.timestamp).toLocaleDateString()}</span>
                              </div>
                              <div className="pl-11 text-gray-600 font-serif mb-2">"{req.content}"</div>
                              <div className="pl-11 text-xs text-green-600 font-bold flex items-center">
                                  <Heart className="w-3 h-3 mr-1 fill-current" /> {req.prayerCount} prayers received
                              </div>
                          </div>
                          {user?.role === UserRole.ADMIN && (
                              <button 
                                onClick={() => handleDeletePrayer(req.id)}
                                className="text-gray-400 hover:text-red-500 p-2"
                                title="Remove Request"
                              >
                                  <Trash2 className="w-4 h-4" />
                              </button>
                          )}
                      </div>
                   </li>
                 ))}
               </ul>
           )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {view === 'landing' && renderLanding()}
      {view === 'login' && renderLogin()}
      {view === 'test' && renderTest()}
      {['dashboard', 'applications-list', 'prayer-list', 'schedule-manager'].includes(view) && renderDashboard()}
    </div>
  );
};

export default PastorPortal;