/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Target, 
  Zap, 
  ShieldCheck, 
  Settings, 
  Scan, 
  Activity, 
  Cpu, 
  Users, 
  Clock, 
  Sun, 
  Moon, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FUNCTIONS, PanelFunction, LogEntry, SystemStats } from './types.ts';

const LucideIcon = ({ name, className }: { name: string, className?: string }) => {
  switch (name) {
    case 'Target': return <Target className={className} />;
    case 'Focus': return <Scan className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'Settings': return <Settings className={className} />;
    default: return <Settings className={className} />;
  }
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeFunctions, setActiveFunctions] = useState<number[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [startTime] = useState(Date.now());
  const [uptime, setUptime] = useState('00:00:00');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [gameVersion, setGameVersion] = useState<'normal' | 'max'>('normal');
  const [stats, setStats] = useState({
    totalUsers: '12,450',
    totalSessions: '45,230',
    uptime: '99.9%',
    avgSpeed: '94.2%'
  });
  const [dpiValue, setDpiValue] = useState(1200);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [keyInput, setKeyInput] = useState('');
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [authError, setAuthError] = useState('');

  const consoleRef = useRef<HTMLDivElement>(null);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.body.classList.add('light-mode');
    }

    const storedExpiry = localStorage.getItem('key_expiry');
    if (storedExpiry) {
       const expiry = new Date(parseInt(storedExpiry));
       if (expiry > new Date()) {
          setIsAuthenticated(true);
          setExpirationDate(expiry);
       } else {
          localStorage.removeItem('key_expiry');
          localStorage.removeItem('valid_key');
       }
    }
    setIsCheckingAuth(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      addLog('Hệ thống đã khởi tạo...', 'info');
      addLog('Bảng điều khiển đã sẵn sàng hoạt động', 'success');
    }
  }, [isAuthenticated]);

  // Update theme class on body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  // Uptime counter
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const h = Math.floor(elapsed / 3600);
      const m = Math.floor((elapsed % 3600) / 60);
      const s = elapsed % 60;
      setUptime(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  // Periodic random stats simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        totalUsers: (Math.floor(Math.random() * (20000 - 10000) + 10000)).toLocaleString('vi-VN'),
        totalSessions: (Math.floor(Math.random() * (50000 - 40000) + 40000)).toLocaleString('vi-VN'),
        uptime: (Math.random() * (100 - 95) + 95).toFixed(1) + '%',
        avgSpeed: (Math.random() * (100 - 90) + 90).toFixed(1) + '%'
      });
      
      if (activeFunctions.length > 0) {
        addLog(`📊 Đang xử lý ${activeFunctions.length} hàm...`, 'info');
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [activeFunctions.length]);

  // Auto-scroll console
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = 0; // The logs are prepended, so top is the latest
    }
  }, [logs]);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const time = new Date().toLocaleTimeString('vi-VN');
    const newEntry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: time,
      message,
      type
    };
    setLogs(prev => [newEntry, ...prev].slice(0, 50));
  };

  const toggleFunction = (id: number, name: string) => {
    setActiveFunctions(prev => {
      const isActive = prev.includes(id);
      if (isActive) {
        addLog(`✗ ${name} đã tắt`, 'error');
        return prev.filter(fid => fid !== id);
      } else {
        const message = id === 3 
          ? `✓ ${name} kích hoạt thành công (DPI: ${dpiValue})!` 
          : `✓ ${name} kích hoạt thành công!`;
        addLog(message, 'success');
        return [...prev, id];
      }
    });
  };

  const handleDpiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setDpiValue(val);
    
    // Log the update if the DPI function is currently active
    if (activeFunctions.includes(3)) {
      // Use a small debounce or logic to prevent flood if needed, 
      // but for now simple logging on every change as requested.
      addLog(`⚡ Cập nhật DPI: ${val}`, 'info');
    }
  };

  const activateAll = () => {
    const allIds = FUNCTIONS.map(f => f.id);
    setActiveFunctions(allIds);
    addLog('→ Kích hoạt tất cả các hàm', 'success');
  };

  const deactivateAll = () => {
    setActiveFunctions([]);
    addLog('→ Tắt tất cả các hàm', 'error');
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('Console cleared', 'info');
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    addLog(`→ Đã chuyển sang chế độ ${newMode ? 'tối' : 'sáng'}`, 'info');
  };

  const handleGameVersionChange = (version: 'normal' | 'max') => {
    setGameVersion(version);
    addLog(`🎮 Đã chọn phiên bản: ${version === 'normal' ? 'FF Thường' : 'FF MAX'}`, 'info');
  };

  const getHealthStatus = () => {
    const count = activeFunctions.length;
    if (count === 0) return { text: '✓ Bình thường', color: 'text-emerald-500' };
    if (count <= 2) return { text: '⚡ Ổn định', color: 'text-cyan-500' };
    if (count <= 4) return { text: '🔴 Tải nặng', color: 'text-orange-500' };
    return { text: '⚠️ Nguy hiểm!', color: 'text-red-500' };
  };

  const health = getHealthStatus();

  const getFunctionName = (f: PanelFunction) => {
    if (f.id === 4) return `Bypass ${gameVersion === 'normal' ? 'FF Thường' : 'FF MAX'}`;
    if (f.id === 5) return `Optimize ${gameVersion === 'normal' ? 'FF Thường' : 'FF MAX'}`;
    return f.name;
  };

  const getFunctionDescription = (f: PanelFunction) => {
    if (f.id === 5) return `Tối ưu hóa hệ thống cho Free Fire ${gameVersion === 'normal' ? 'Thường' : 'MAX'}`;
    return f.description;
  };

  const logout = () => {
    localStorage.removeItem('key_expiry');
    localStorage.removeItem('valid_key');
    setIsAuthenticated(false);
    setKeyInput('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const VALID_KEYS: Record<string, number> = {
      'chuquang@': 30 * 24 * 60 * 60 * 1000,
      'chuquang2011': 60 * 24 * 60 * 60 * 1000,
      'chuquang': 1 * 24 * 60 * 60 * 1000,
    };
    
    const key = keyInput.trim();
    const duration = VALID_KEYS[key];
    
    if (duration) {
       const expiry = new Date(Date.now() + duration);
       localStorage.setItem('key_expiry', expiry.getTime().toString());
       localStorage.setItem('valid_key', key);
       setIsAuthenticated(true);
       setExpirationDate(expiry);
       setAuthError('');
    } else {
       setAuthError('Key không hợp lệ hoặc đã hết hạn.');
    }
  };

  if (isCheckingAuth) {
    return null; // Or a simple loader
  }

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center font-sans transition-colors duration-500 ${isDarkMode ? 'dark bg-slate-950 text-white' : 'light bg-slate-50 text-slate-900'}`}>
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px]" />
        </div>
        
        <div className={`relative z-10 w-full max-w-md p-8 rounded-2xl border backdrop-blur-md shadow-2xl ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white/90 border-slate-200'}`}>
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg active-glow mb-4">
              <Target className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-display font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent text-center">
              FF GHOST PANEL
            </h1>
            <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Hệ Thống Xác Thực License</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                License Key
              </label>
              <input
                type="text"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Nhập mã kích hoạt..."
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}`}
              />
              {authError && (
                <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} className="text-red-500 text-xs mt-2 flex items-center gap-1 font-medium">
                  <AlertTriangle size={12} /> {authError}
                </motion.div>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all shadow-lg active-glow"
            >
              Kích Hoạt & Đăng Nhập
            </button>
          </form>

          <div className={`mt-6 text-center text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Bảo mật mã hóa đầu cuối 🔒
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? 'dark bg-slate-950' : 'light bg-slate-50'}`}>
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isDarkMode ? 'bg-slate-950/80' : 'bg-white/80'} backdrop-blur-md border-b ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg active-glow">
                <Target className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-display font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent leading-none">
                  FF GHOST PANEL
                </span>
                {expirationDate && (
                  <span className="text-[10px] font-mono text-emerald-500 mt-1 uppercase">
                    Hạn dùng: {expirationDate.toLocaleDateString('vi-VN')} {expirationDate.toLocaleTimeString('vi-VN')}
                  </span>
                )}
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {['Chức năng', 'Thống kê', 'Console'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`text-sm font-medium transition-colors hover:text-emerald-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  {item}
                </a>
              ))}
              <button
                onClick={logout}
                className={`text-sm font-medium transition-colors hover:text-red-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
              >
                Đăng xuất
              </button>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
              >
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
              >
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden ${isDarkMode ? 'bg-slate-900 border-b border-white/10' : 'bg-white border-b border-slate-200'}`}
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {['Chức năng', 'Thống kê', 'Console'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-4 text-base font-medium rounded-md ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                  >
                    {item}
                  </a>
                ))}
                <button
                    onClick={() => { setIsMenuOpen(false); logout(); }}
                    className={`w-full text-left block px-3 py-4 text-base font-medium rounded-md text-red-500 ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                  >
                    Đăng xuất
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12 sm:px-6 lg:px-8 space-y-12">
        
        {/* Stats Grid */}
        <section id="thống kê" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Người dùng', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
            { label: 'Tốc độ', value: stats.avgSpeed, icon: Activity, color: 'text-emerald-500' },
            { label: 'Hoạt động', value: `${activeFunctions.length}/5`, icon: Cpu, color: 'text-purple-500' },
            { label: 'Trạng thái', value: health.text, icon: ShieldCheck, color: health.color },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                  <stat.icon size={18} className={stat.color} />
                </div>
                <span className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {stat.label}
                </span>
              </div>
              <div className="text-xl md:text-2xl font-display font-bold">
                {stat.value}
              </div>
            </motion.div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Functions Panel */}
          <section id="chức năng" className="lg:col-span-2 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                <LayoutDashboard className="text-emerald-500" /> Bảng Điều Khiển
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={activateAll}
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 size={14} /> Bật Tất Cả
                </button>
                <button 
                  onClick={deactivateAll}
                  className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${isDarkMode ? 'border-white/10 text-white hover:bg-white/5' : 'border-slate-200 text-slate-900 hover:bg-slate-50'}`}
                >
                  <XCircle size={14} /> Tắt Tất Cả
                </button>
              </div>
            </div>

            <div className={`p-5 rounded-xl border flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div>
                <h3 className="font-bold text-sm">Phiên Bản Trò Chơi</h3>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Chọn cấu hình cho phiên bản Free Fire của bạn
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                  <label className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg cursor-pointer border transition-colors ${gameVersion === 'normal' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : (isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-50')}`}>
                     <input type="radio" className="hidden" name="gameVersion" checked={gameVersion === 'normal'} onChange={() => handleGameVersionChange('normal')} />
                     <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${gameVersion === 'normal' ? 'border-emerald-500' : 'border-current'}`}><span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${gameVersion === 'normal' ? 'block' : 'hidden'}`} /></span>
                     FF Thường
                  </label>
                  <label className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg cursor-pointer border transition-colors ${gameVersion === 'max' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : (isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-50')}`}>
                     <input type="radio" className="hidden" name="gameVersion" checked={gameVersion === 'max'} onChange={() => handleGameVersionChange('max')} />
                     <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${gameVersion === 'max' ? 'border-emerald-500' : 'border-current'}`}><span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${gameVersion === 'max' ? 'block' : 'hidden'}`} /></span>
                     FF MAX
                  </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FUNCTIONS.map((f, i) => {
                const isActive = activeFunctions.includes(f.id);
                return (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                      isActive 
                        ? (isDarkMode ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-emerald-50 border-emerald-200') 
                        : (isDarkMode ? 'bg-white/5 border-white/10 hover:border-white/20' : 'bg-white border-slate-200 shadow-sm hover:shadow-md')
                    }`}
                  >
                    <div className="flex items-start justify-between relative z-10">
                      <div className="flex gap-4">
                        <div className={`p-3 rounded-xl transition-colors ${
                          isActive 
                            ? 'bg-emerald-500 text-white' 
                            : (isDarkMode ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500')
                        }`}>
                          <LucideIcon name={f.icon} className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold">{getFunctionName(f)} {f.id === 3 && `(${dpiValue})`}</h3>
                          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {getFunctionDescription(f)}
                          </p>
                          
                          {f.id === 3 && (
                            <div className="mt-4 space-y-2">
                              <div className="flex justify-between text-[10px] font-mono opacity-60">
                                <span>MIN: 400</span>
                                <span>CURRENT: {dpiValue}</span>
                                <span>MAX: 2400</span>
                              </div>
                              <input 
                                type="range" 
                                min="400" 
                                max="2400" 
                                step="50"
                                value={dpiValue}
                                onChange={handleDpiChange}
                                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFunction(f.id, getFunctionName(f))}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isActive ? 'bg-emerald-500' : (isDarkMode ? 'bg-slate-700' : 'bg-slate-200')
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isActive ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {isActive && (
                      <div className="mt-4 flex items-center justify-between relative z-10">
                        <span className="text-[10px] uppercase font-bold text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 size={10} /> Đang chạy
                        </span>
                        <div className="flex gap-1">
                          {[1, 2, 3].map(dot => (
                            <motion.div 
                              key={dot}
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ repeat: Infinity, duration: 1.5, delay: dot * 0.2 }}
                              className="w-1 h-1 rounded-full bg-emerald-500" 
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Uptime Stat Box */}
              <div className={`p-5 rounded-2xl border flex flex-col justify-between ${isDarkMode ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-white/10' : 'bg-indigo-50 border-indigo-100 shadow-sm'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium opacity-70">Uptime System</span>
                  <Clock size={20} className="text-indigo-500" />
                </div>
                <div className="text-3xl font-display font-bold mt-4 font-mono tracking-tighter">
                  {uptime}
                </div>
                <div className="text-xs opacity-60 mt-2">Thời gian hoạt động thực tế</div>
              </div>
            </div>
          </section>

          {/* Console / Log Panel */}
          <section id="console" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                <Terminal className="text-emerald-500" /> Hệ Thống
              </h2>
              <button 
                onClick={clearLogs}
                className={`text-xs font-medium px-3 py-1 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500 border border-slate-200'}`}
              >
                Clear Log
              </button>
            </div>

            <div className={`rounded-2xl border h-[420px] flex flex-col overflow-hidden ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-950 border-slate-800'}`}>
              <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-[10px] font-mono text-white/40 uppercase tracking-widest">Live Activity Log</span>
              </div>
              
              <div 
                ref={consoleRef}
                className="flex-1 overflow-y-auto p-4 font-mono text-[13px] space-y-2 scrollbar-thin scrollbar-thumb-white/10"
              >
                {logs.length === 0 ? (
                  <div className="text-white/20 italic">No logs recorded...</div>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="flex gap-2 leading-relaxed">
                      <span className="text-white/30 shrink-0">[{log.timestamp}]</span>
                      <span className={`
                        ${log.type === 'success' ? 'text-emerald-400' : ''}
                        ${log.type === 'error' ? 'text-red-400' : ''}
                        ${log.type === 'warning' ? 'text-yellow-400' : ''}
                        ${log.type === 'info' ? 'text-cyan-400' : ''}
                      `}>
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 py-3 bg-white/5 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-white/60">CONNECTED</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono text-white/40">
                  <span>RAM: 1.2GB</span>
                  <span>CPU: 12%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h4 className="text-sm font-bold mb-3 flex items-center gap-2"><Settings size={16} /> Tiện ích nhanh</h4>
              <div className="space-y-2">
                <button 
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group ${isDarkMode ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-50 text-slate-600'}`}
                  onClick={() => addLog('🔍 Đang kiểm tra cập nhật...', 'info')}
                >
                  Kiểm tra cập nhật <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </button>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group ${isDarkMode ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-50 text-slate-600'}`}
                  onClick={() => addLog('🧹 Đang dọn dẹp bộ nhớ đệm...', 'info')}
                >
                  Dọn dẹp Cache <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

    </div>
  );
}

