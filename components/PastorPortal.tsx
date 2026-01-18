import React, { useState, useEffect } from 'react';
import { Shield, User as UserIcon, MessageCircleHeart, Lock, Send, Loader2, CheckCircle, X, ChevronLeft, Briefcase, FileText, Users, LogOut, AlertCircle, UserPlus, Clock, GraduationCap, ChevronRight, Trash2, Heart, Database, Settings } from 'lucide-react';
import { AuthService } from '../services/authService';
import { PrayerService } from '../services/prayerService';
import { StorageService } from '../services/storageService';
import { User, UserRole, PrayerRequest, CloudSettings } from '../types';

type PortalView = 'landing' | 'login' | 'dashboard' | 'applications-list' | 'prayer-list' | 'test' | 'settings';

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

  // Prayer List State
  const [communityPrayers, setCommunityPrayers] = useState<PrayerRequest[]>([]);

  // Cloud Settings State
  const [cloudSettings, setCloudSettings] = useState<CloudSettings>({
      enabled: false,
      provider: 'JSONBIN',
      apiKey: '',
      binId: ''
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // Dashboard State
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
  
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setView('dashboard');
    }
    const savedSettings = StorageService.getCloudSettings();
    if(savedSettings) setCloudSettings(savedSettings);
  }, []);

  useEffect(() => {
    if (view === 'applications-list' && user?.role === UserRole.ADMIN) {
      loadPendingUsers();
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

  const handleApproveUser = async (username: string) => {
     await AuthService.approveUser(username);
     loadPendingUsers(); 
  };

  const handleRejectUser = async (username: string) => {
     await AuthService.rejectUser(username);
     loadPendingUsers(); 
  };

  const handleSaveSettings = (e: React.FormEvent) => {
     e.preventDefault();
     StorageService.saveCloudSettings(cloudSettings);
     setSettingsSaved(true);
     setTimeout(() => setSettingsSaved(false), 3000);
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
        const passed = newScore >= 4;
        setTestPassed(passed);
        setShowQuizResult(true);
    }
  };

  const handleProceedToRegistration = () => {
    setIsRegistering(true);
    setMinistryCode('GRACE');
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

         <div onClick={() => setView('settings')} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-gray-500 cursor-pointer hover:bg-gray-50 transition-colors group">
            <Settings className="w-8 h-8 text-gray-500 mb-2 group-hover:rotate-90 transition-transform" />
            <h3 className="text-gray-800 text-lg font-bold">System Settings</h3>
            <p className="text-sm text-gray-500">Configure Cloud Sync.</p>
         </div>
      </div>

      {/* Lists */}
      {view === 'settings' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden animate-fade-in border border-gray-100">
            <div className="bg-church-50 px-6 py-4 border-b border-church-100 flex justify-between items-center">
                <h3 className="font-bold text-church-800 flex items-center"><Database className="w-4 h-4 mr-2" /> Cloud Persistence Settings</h3>
                <button onClick={() => setView('dashboard')} className="text-sm text-church-600 hover:underline">Close</button>
            </div>
            <div className="p-8">
                <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-2">Enable Cross-Device Sync</h4>
                    <p className="text-sm text-blue-600">
                        To persist data (Videos, Prayers) across different devices (e.g., on Vercel), you must connect a backend storage. 
                        We support <strong>JSONBin.io</strong>. Create a free account, get an API Key and create a Bin, then enter details below.
                    </p>
                </div>
                
                <form onSubmit={handleSaveSettings} className="space-y-4 max-w-lg">
                    <div className="flex items-center mb-4">
                        <input 
                            type="checkbox" 
                            id="cloudEnabled"
                            checked={cloudSettings.enabled}
                            onChange={e => setCloudSettings({...cloudSettings, enabled: e.target.checked})}
                            className="mr-2 h-4 w-4 text-church-600 focus:ring-church-500 border-gray-300 rounded"
                        />
                        <label htmlFor="cloudEnabled" className="font-bold text-gray-700">Enable Cloud Storage</label>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">JSONBin Master Key (X-Master-Key)</label>
                        <input 
                            type="password"
                            value={cloudSettings.apiKey}
                            onChange={e => setCloudSettings({...cloudSettings, apiKey: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-church-500 outline-none"
                            placeholder="$2a$10$..."
                            disabled={!cloudSettings.enabled}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bin ID</label>
                        <input 
                            type="text"
                            value={cloudSettings.binId}
                            onChange={e => setCloudSettings({...cloudSettings, binId: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-church-500 outline-none"
                            placeholder="65e..."
                            disabled={!cloudSettings.enabled}
                        />
                    </div>

                    <button 
                        type="submit"
                        className="px-6 py-2 bg-church-600 text-white font-bold rounded-lg hover:bg-church-700 disabled:opacity-50"
                        disabled={!cloudSettings.enabled && !settingsSaved}
                    >
                        Save Configuration
                    </button>

                    {settingsSaved && <span className="ml-4 text-green-600 font-bold animate-pulse">Settings Saved!</span>}
                </form>
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
};

export default PastorPortal;