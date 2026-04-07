/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  MoreVertical, 
  X, 
  Filter, 
  Settings, 
  Globe, 
  History, 
  Shield, 
  Info, 
  Heart, 
  Star, 
  Download,
  ChevronRight,
  RefreshCw,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { TorrentProvider, TorrentResult, AppTheme, AppSettings, DEFAULT_PROVIDERS } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'settings' | 'toggle-engines' | 'set-urls'>('home');
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Persisted States
  const [theme, setTheme] = useState<AppTheme>(() => (localStorage.getItem('theme') as AppTheme) || 'Dark');
  const [trueBlack, setTrueBlack] = useState(() => localStorage.getItem('trueBlack') !== 'false');
  const [providers, setProviders] = useState<TorrentProvider[]>(() => {
    const saved = localStorage.getItem('providers');
    return saved ? JSON.parse(saved) : DEFAULT_PROVIDERS;
  });
  const [hideNoSeeders, setHideNoSeeders] = useState(() => localStorage.getItem('hideNoSeeders') !== 'false');
  const [hideAdult, setHideAdult] = useState(() => localStorage.getItem('hideAdult') === 'true');
  const [searchTimeout, setSearchTimeout] = useState(() => Number(localStorage.getItem('searchTimeout')) || 15);

  const [results, setResults] = useState<TorrentResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAddCustomDialog, setShowAddCustomDialog] = useState(false);
  const [showTestUrlDialog, setShowTestUrlDialog] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'size-desc' | 'size-asc' | 'seeds' | 'date' | 'category'>('seeds');
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);
  const [selectedResult, setSelectedResult] = useState<TorrentResult | null>(null);
  const [customUrl, setCustomUrl] = useState('');
  const [testingStatus, setTestingStatus] = useState<Record<string, 'pending' | 'ok' | 'failed'>>({});
  const [editingProviderIndex, setEditingProviderIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [tempProviders, setTempProviders] = useState<TorrentProvider[]>([]);

  // Custom Dialog States
  const [dialogConfig, setDialogConfig] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'alert' | 'confirm';
    onConfirm?: () => void;
  }>({ show: false, title: '', message: '', type: 'alert' });

  const showAlert = (title: string, message: string) => {
    setDialogConfig({ show: true, title, message, type: 'alert' });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setDialogConfig({ show: true, title, message, type: 'confirm', onConfirm });
  };

  // Persistence Effects
  useEffect(() => { localStorage.setItem('theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('trueBlack', String(trueBlack)); }, [trueBlack]);
  useEffect(() => { localStorage.setItem('providers', JSON.stringify(providers)); }, [providers]);
  useEffect(() => { localStorage.setItem('hideNoSeeders', String(hideNoSeeders)); }, [hideNoSeeders]);
  useEffect(() => { localStorage.setItem('hideAdult', String(hideAdult)); }, [hideAdult]);
  useEffect(() => { localStorage.setItem('searchTimeout', String(searchTimeout)); }, [searchTimeout]);

  const categories = ["All", "Movies", "TV", "Anime", "Music", "Applications", "Games", "Books", "Others"];

  // Theme colors
  const isDark = theme === 'Dark' || (theme === 'Auto' && true); // Simplified auto
  const bgColor = isDark ? (trueBlack ? 'bg-black' : 'bg-[#121212]') : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-black';
  const accentColor = 'text-[#A3E635]';
  const accentBg = 'bg-[#A3E635]';

  const handleSearch = () => {
    if (!searchQuery) return;
    setIsSearching(true);
    setIsFilterOpen(false);
    
    // Simulate parallel search from all enabled providers
    const enabledProviders = providers.filter(p => p.isEnabled);
    
    setTimeout(() => {
      let allResults: TorrentResult[] = [];
      
      enabledProviders.forEach(provider => {
        const providerResults: TorrentResult[] = [
          { 
            title: `${searchQuery} (2024) [1080p]`, 
            size: `${(Math.random() * 5 + 1).toFixed(1)} GB`, 
            seeds: Math.floor(Math.random() * 2000), 
            leeches: Math.floor(Math.random() * 200), 
            category: "Movies", 
            source: provider.name, 
            magnetUrl: `magnet:?xt=urn:btih:${Math.random().toString(36).substring(7)}&dn=${encodeURIComponent(searchQuery)}`,
            uploadDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            quality: "1080p"
          },
          { 
            title: `${searchQuery} S01E01 WEB-DL 720p`, 
            size: `${Math.floor(Math.random() * 900 + 100)} MB`, 
            seeds: Math.floor(Math.random() * 1000), 
            leeches: Math.floor(Math.random() * 100), 
            category: "TV", 
            source: provider.name, 
            magnetUrl: `magnet:?xt=urn:btih:${Math.random().toString(36).substring(7)}&dn=${encodeURIComponent(searchQuery)}`,
            uploadDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            quality: "720p"
          },
          { 
            title: `${searchQuery} 4K UHD BluRay`, 
            size: `${(Math.random() * 20 + 10).toFixed(1)} GB`, 
            seeds: Math.floor(Math.random() * 500), 
            leeches: Math.floor(Math.random() * 50), 
            category: "Movies", 
            source: provider.name, 
            magnetUrl: `magnet:?xt=urn:btih:${Math.random().toString(36).substring(7)}&dn=${encodeURIComponent(searchQuery)}`,
            uploadDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            quality: "4K"
          },
        ];
        allResults = [...allResults, ...providerResults];
      });
      
      // Apply filters
      let filtered = allResults;
      if (hideNoSeeders) filtered = filtered.filter(r => r.seeds > 0);
      if (selectedCategory !== 'All') filtered = filtered.filter(r => r.category === selectedCategory);
      if (selectedQualities.length > 0) {
        filtered = filtered.filter(r => r.quality && selectedQualities.includes(r.quality));
      }
      
      // Apply Sorting
      filtered.sort((a, b) => {
        const parseSize = (s: string) => {
          const val = parseFloat(s);
          return s.includes('GB') ? val * 1024 : val;
        };

        if (sortBy === 'seeds') return b.seeds - a.seeds;
        if (sortBy === 'category') return a.category.localeCompare(b.category);
        if (sortBy === 'date') return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        if (sortBy === 'size-desc') return parseSize(b.size) - parseSize(a.size);
        if (sortBy === 'size-asc') return parseSize(a.size) - parseSize(b.size);
        return 0;
      });
      
      setResults(filtered);
      setIsSearching(false);
    }, 1500);
  };

  const handleTestUrls = () => {
    setIsSideMenuOpen(false);
    setShowTestUrlDialog(true);
    const initialStatus: Record<string, 'pending' | 'ok' | 'failed'> = {};
    providers.forEach(p => initialStatus[p.name] = 'pending');
    setTestingStatus(initialStatus);

    // Simulate scanning
    providers.forEach((p, i) => {
      setTimeout(() => {
        setTestingStatus(prev => ({
          ...prev,
          [p.name]: Math.random() > 0.8 ? 'failed' : 'ok'
        }));
      }, 800 + Math.random() * 1000); // More varied "live" feel
    });
  };

  const handleBrowseTop = () => {
    setIsSearching(true);
    setSearchQuery('');
    setTimeout(() => {
      const trending: TorrentResult[] = [
        { title: "Trending Movie 2026 4K", size: "12.5 GB", seeds: 5600, leeches: 400, category: "Movies", source: "YIFY", magnetUrl: "magnet:?xt=...", uploadDate: new Date().toISOString(), quality: "4K" },
        { title: "Popular Series S05 Complete", size: "45.2 GB", seeds: 3200, leeches: 150, category: "TV", source: "1337X", magnetUrl: "magnet:?xt=...", uploadDate: new Date().toISOString(), quality: "1080p" },
        { title: "Latest AAA Game Repack", size: "65.0 GB", seeds: 8900, leeches: 1200, category: "Games", source: "TorrentGalaxy", magnetUrl: "magnet:?xt=...", uploadDate: new Date().toISOString() },
        { title: "Essential App v10.0", size: "250 MB", seeds: 120, leeches: 5, category: "Applications", source: "TPB", magnetUrl: "magnet:?xt=...", uploadDate: new Date().toISOString() },
      ];
      setResults(trending);
      setIsSearching(false);
    }, 1200);
  };

  const addCustomWebsite = () => {
    if (!customUrl) return;
    const cleanUrl = customUrl.startsWith('http') ? customUrl : `https://${customUrl}`;
    const domain = cleanUrl.replace('https://', '').replace('http://', '').split('/')[0];
    const name = domain.split('.').length > 2 ? domain.split('.')[1] : domain.split('.')[0];
    
    const newProvider: TorrentProvider = {
      name: name.toUpperCase(),
      url: cleanUrl,
      isEnabled: true,
      isCustom: true
    };
    setProviders([...providers, newProvider]);
    setCustomUrl('');
    setShowAddCustomDialog(false);
  };

  return (
    <div className={cn("fixed inset-0 flex flex-col font-sans transition-colors duration-300", bgColor, textColor)}>
      {/* Status Bar Mockup */}
      <div className="h-6 flex items-center justify-between px-4 text-[10px] opacity-60">
        <span>9:41</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full border border-current" />
          <div className="w-3 h-3 rounded-full border border-current" />
          <div className="w-5 h-3 border border-current rounded-sm relative">
            <div className="absolute inset-y-0 left-0 bg-current w-3/4" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Screen: Home */}
        <AnimatePresence mode="wait">
          {currentScreen === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col"
            >
              {/* Top Bar */}
              <div className="h-14 flex items-center justify-between px-4">
                <h1 className={cn("text-xl font-bold", accentColor)}>Torrent X</h1>
                <button onClick={() => setIsSideMenuOpen(true)}>
                  <MoreVertical className="w-6 h-6" />
                </button>
              </div>

              {/* Search Section */}
              <div className="p-4 space-y-4">
                <div className={cn("relative flex items-center rounded-xl px-4 py-3 border", isDark ? "bg-[#1E1E1E] border-white/10" : "bg-gray-100 border-black/5")}>
                  <Search className="w-5 h-5 opacity-40 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Search Torrent"
                    className="flex-1 bg-transparent outline-none text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="p-1">
                      <X className="w-4 h-4 opacity-40" />
                    </button>
                  )}
                  <div className="relative">
                    <button 
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className={cn("p-1 ml-1 transition-colors", isFilterOpen ? accentColor : "opacity-40")}
                    >
                      <Filter className="w-4 h-4" />
                    </button>
                    
                    <AnimatePresence>
                      {isFilterOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className={cn(
                            "absolute right-0 mt-2 w-56 rounded-xl shadow-2xl z-50 border p-2 overflow-y-auto max-h-[400px]",
                            isDark ? "bg-[#1E1E1E] border-white/10" : "bg-white border-black/10"
                          )}
                        >
                          <p className="text-[10px] font-bold uppercase opacity-50 px-3 py-2">Sort By</p>
                          {[
                            { id: 'seeds', label: 'Seeder Count (Highest)' },
                            { id: 'size-desc', label: 'App Size (High to Low)' },
                            { id: 'size-asc', label: 'App Size (Low to High)' },
                            { id: 'date', label: 'Upload Date (Newest)' },
                            { id: 'category', label: 'Category' }
                          ].map(opt => (
                            <button
                              key={opt.id}
                              onClick={() => {
                                setSortBy(opt.id as any);
                                handleSearch();
                              }}
                              className={cn(
                                "w-full text-left px-3 py-2 rounded-lg text-xs transition-colors mb-1 flex items-center justify-between",
                                sortBy === opt.id ? cn(accentBg, "text-black") : "hover:bg-white/5"
                              )}
                            >
                              <span>{opt.label}</span>
                              {sortBy === opt.id && <Check className="w-3 h-3" />}
                            </button>
                          ))}

                          <div className="h-px bg-white/10 my-2" />
                          <p className="text-[10px] font-bold uppercase opacity-50 px-3 py-2">Video Quality</p>
                          <div className="grid grid-cols-2 gap-1 px-2">
                            {["4K", "1080p", "720p", "BluRay", "CAM", "HDR"].map(q => (
                              <button
                                key={q}
                                onClick={() => {
                                  const next = selectedQualities.includes(q) 
                                    ? selectedQualities.filter(item => item !== q)
                                    : [...selectedQualities, q];
                                  setSelectedQualities(next);
                                }}
                                className={cn(
                                  "px-2 py-1.5 rounded-lg text-[10px] border transition-all",
                                  selectedQualities.includes(q)
                                    ? cn(accentBg, "text-black border-transparent font-bold")
                                    : cn(isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10")
                                )}
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Categories */}
                <div className="overflow-x-auto pb-2 no-scrollbar">
                  <div className="flex gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border",
                          selectedCategory === cat 
                            ? cn(accentBg, "text-black border-transparent font-medium") 
                            : cn(isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10")
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <button 
                    onClick={handleSearch}
                    disabled={isSearching}
                    className={cn("w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-transform active:scale-95", accentBg, "text-black")}
                  >
                    {isSearching ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    Search
                  </button>
                  <button 
                    onClick={handleBrowseTop}
                    className={cn("w-full py-4 rounded-xl border font-bold transition-transform active:scale-95", accentColor, "border-[#A3E635]")}
                  >
                    Browse Top Torrents
                  </button>
                </div>
              </div>

              {/* Results or Placeholder */}
              <div className="flex-1 overflow-y-auto px-4">
                {results.length > 0 ? (
                  <div className="space-y-3 pb-20">
                    {results.map((res, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setSelectedResult(res)}
                        className={cn(
                          "p-4 rounded-xl border cursor-pointer transition-transform active:scale-[0.98]", 
                          isDark ? "bg-[#1E1E1E] border-white/10 hover:border-[#A3E635]/30" : "bg-gray-50 border-black/5 hover:border-[#A3E635]/30"
                        )}
                      >
                        <h3 className="font-medium text-sm mb-2 line-clamp-2">{res.title}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] opacity-60">
                          <span>{res.size}</span>
                          <span className="text-green-500">{res.seeds} Seeds</span>
                          <span className="text-red-500">{res.leeches} Leeches</span>
                          <span className={accentColor}>{res.source}</span>
                          {res.quality && <span className="bg-white/10 px-1 rounded">{res.quality}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-20">
                    <Download className="w-16 h-16 mb-4" />
                    <p className="text-sm">Search for something to see results</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Screen: Settings */}
          {currentScreen === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col"
            >
              <div className="h-14 flex items-center px-4 gap-4">
                <button onClick={() => setCurrentScreen('home')}>
                  <X className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">Settings</h1>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* User Interface */}
                <section>
                  <h2 className={cn("text-[10px] font-bold uppercase tracking-widest mb-3", accentColor)}>User Interface</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">App Theme</p>
                        <p className="text-[10px] opacity-50">{theme}</p>
                      </div>
                      <select 
                        value={theme} 
                        onChange={(e) => setTheme(e.target.value as AppTheme)}
                        className="bg-transparent text-sm outline-none"
                      >
                        <option value="Dark">Dark</option>
                        <option value="Light">Light</option>
                        <option value="Auto">Auto</option>
                      </select>
                    </div>
                    {theme === 'Dark' && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm">True Black on Dark Mode</p>
                        <button 
                          onClick={() => setTrueBlack(!trueBlack)}
                          className={cn("w-10 h-5 rounded-full relative transition-colors", trueBlack ? accentBg : "bg-gray-600")}
                        >
                          <div className={cn("absolute top-1 w-3 h-3 rounded-full bg-white transition-all", trueBlack ? "left-6" : "left-1")} />
                        </button>
                      </div>
                    )}
                  </div>
                </section>

                {/* Search Providers */}
                <section>
                  <h2 className={cn("text-[10px] font-bold uppercase tracking-widest mb-3", accentColor)}>Search Providers</h2>
                  <div className="space-y-4">
                    <button 
                      onClick={() => setCurrentScreen('toggle-engines')}
                      className="w-full flex items-center justify-between py-2"
                    >
                      <p className="text-sm">Toggle Search Engines</p>
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    </button>
                    <button 
                      onClick={() => {
                        setTempProviders(JSON.parse(JSON.stringify(providers)));
                        setCurrentScreen('set-urls');
                      }}
                      className="w-full flex items-center justify-between py-2"
                    >
                      <p className="text-sm">Set Search Engines URL</p>
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    </button>
                    <button 
                      onClick={() => setShowAddCustomDialog(true)}
                      className={cn("w-full py-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium", accentColor, "border-[#A3E635]")}
                    >
                      <Plus className="w-4 h-4" />
                      Add Custom Website
                    </button>
                  </div>
                </section>

                {/* Miscellaneous */}
                <section>
                  <h2 className={cn("text-[10px] font-bold uppercase tracking-widest mb-3", accentColor)}>Miscellaneous</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Hide Torrents With No Seeders</p>
                      <button 
                        onClick={() => setHideNoSeeders(!hideNoSeeders)}
                        className={cn("w-10 h-5 rounded-full relative transition-colors", hideNoSeeders ? accentBg : "bg-gray-600")}
                      >
                        <div className={cn("absolute top-1 w-3 h-3 rounded-full bg-white transition-all", hideNoSeeders ? "left-6" : "left-1")} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Hide Adult Torrents</p>
                      <button 
                        onClick={() => setHideAdult(!hideAdult)}
                        className={cn("w-10 h-5 rounded-full relative transition-colors", hideAdult ? accentBg : "bg-gray-600")}
                      >
                        <div className={cn("absolute top-1 w-3 h-3 rounded-full bg-white transition-all", hideAdult ? "left-6" : "left-1")} />
                      </button>
                    </div>
                    <div className="py-2">
                      <p className="text-sm">Set Search Timeout</p>
                      <input 
                        type="range" 
                        className="w-full accent-[#A3E635] mt-2" 
                        min="5" 
                        max="60" 
                        value={searchTimeout} 
                        onChange={(e) => setSearchTimeout(Number(e.target.value))}
                      />
                      <p className="text-[10px] opacity-50 mt-1">{searchTimeout} seconds</p>
                    </div>
                  </div>
                </section>

                {/* Developer Settings */}
                <section>
                  <h2 className={cn("text-[10px] font-bold uppercase tracking-widest mb-3", accentColor)}>Developer Settings</h2>
                  <div className="space-y-4">
                    <button 
                      onClick={handleTestUrls}
                      className="w-full flex items-center justify-between py-2"
                    >
                      <p className="text-sm">Test All Sites</p>
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    </button>
                    <button 
                      onClick={() => {
                        showConfirm('Reset Settings', 'Are you sure you want to reset all settings to default? This will clear all custom providers and preferences.', () => {
                          localStorage.clear();
                          window.location.reload();
                        });
                      }}
                      className="w-full flex items-center justify-between py-2 text-red-500"
                    >
                      <p className="text-sm">Reset Settings</p>
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    </button>
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {/* Screen: Toggle Engines */}
          {currentScreen === 'toggle-engines' && (
            <motion.div 
              key="toggle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="h-full flex flex-col"
            >
              <div className="h-14 flex items-center px-4 gap-4">
                <button onClick={() => setCurrentScreen('settings')}>
                  <X className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">Toggle Search Engines</h1>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {providers.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5">
                    <p className="text-sm">{p.name}</p>
                    <button 
                      onClick={() => {
                        const next = [...providers];
                        next[i].isEnabled = !next[i].isEnabled;
                        setProviders(next);
                      }}
                      className={cn("w-10 h-5 rounded-full relative transition-colors", p.isEnabled ? accentBg : "bg-gray-600")}
                    >
                      <div className={cn("absolute top-1 w-3 h-3 rounded-full bg-white transition-all", p.isEnabled ? "left-6" : "left-1")} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-4 flex gap-3">
                <button 
                  onClick={() => {
                    const allEnabled = providers.every(p => p.isEnabled);
                    setProviders(providers.map(p => ({ ...p, isEnabled: !allEnabled })));
                  }}
                  className={cn("flex-1 py-3 rounded-xl border text-sm font-bold", accentColor, "border-[#A3E635]")}
                >
                  Invert
                </button>
                <button onClick={() => setCurrentScreen('settings')} className={cn("flex-1 py-3 rounded-xl text-sm font-bold", accentBg, "text-black")}>Close</button>
              </div>
            </motion.div>
          )}

          {/* Screen: Set URLs */}
          {currentScreen === 'set-urls' && (
            <motion.div 
              key="urls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="h-full flex flex-col"
            >
              <div className="h-14 flex items-center px-4 gap-4">
                <button onClick={() => setCurrentScreen('settings')}>
                  <X className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">Set Search Engines URL</h1>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {tempProviders.map((p, i) => (
                  <div key={i} className="space-y-1 py-2">
                    <div className="flex items-center justify-between">
                      <input 
                        type="text"
                        value={p.name}
                        onChange={(e) => {
                          const next = [...tempProviders];
                          next[i].name = e.target.value;
                          setTempProviders(next);
                        }}
                        className={cn("text-[10px] font-bold uppercase bg-transparent outline-none border-b border-transparent focus:border-[#A3E635] transition-colors", accentColor)}
                      />
                      <div className="flex gap-3">
                        <RefreshCw className="w-3 h-3 opacity-40" />
                        <Check className="w-3 h-3 opacity-40" />
                      </div>
                    </div>
                    <input 
                      type="text" 
                      value={p.url}
                      onChange={(e) => {
                        const next = [...tempProviders];
                        next[i].url = e.target.value;
                        setTempProviders(next);
                      }}
                      className={cn("w-full bg-transparent border-b text-xs py-1 outline-none", isDark ? "border-white/10" : "border-black/10")}
                    />
                  </div>
                ))}
              </div>
              <div className="p-4 flex gap-3">
                <button onClick={() => setCurrentScreen('settings')} className={cn("flex-1 py-3 rounded-xl border text-sm font-bold opacity-50", isDark ? "border-white/20" : "border-black/20")}>Discard</button>
                <button 
                  onClick={() => {
                    setProviders(tempProviders);
                    setCurrentScreen('settings');
                    showAlert('Success', 'Search engine settings updated successfully!');
                  }} 
                  className={cn("flex-1 py-3 rounded-xl text-sm font-bold", accentBg, "text-black")}
                >
                  Apply
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Side Menu Overlay */}
        <AnimatePresence>
          {isSideMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSideMenuOpen(false)}
                className="absolute inset-0 bg-black/60 z-40"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className={cn("absolute top-0 right-0 bottom-0 w-[280px] z-50 flex flex-col", isDark ? "bg-[#121212]" : "bg-white")}
              >
                <div className="p-6">
                  <h2 className={cn("text-2xl font-bold mb-8", accentColor)}>Torrent X</h2>
                  <div className="space-y-4">
                    {[
                      { icon: Settings, label: 'Settings', action: () => { setCurrentScreen('settings'); setIsSideMenuOpen(false); } },
                      { icon: Globe, label: 'Test URL', action: handleTestUrls },
                      { icon: Heart, label: 'Favorites', action: () => { showAlert('Coming Soon', 'Favorites feature is under development!'); setIsSideMenuOpen(false); } },
                      { icon: Info, label: 'FAQ', action: () => { showAlert('FAQ', 'Frequently Asked Questions section will be available soon.'); setIsSideMenuOpen(false); } },
                      { icon: Star, label: 'Rate App', action: () => { showAlert('Rate App', 'Thank you for your interest! Rating will be available on the app store.'); setIsSideMenuOpen(false); } },
                      { icon: Info, label: 'About', action: () => { showAlert('About Torrent X', 'Torrent X v1.0.0\nBuilt with Kotlin & React\n\nA modern torrent search client.'); setIsSideMenuOpen(false); } },
                    ].map((item, i) => (
                      <button 
                        key={i} 
                        onClick={item.action}
                        className="w-full flex items-center gap-4 py-2 text-sm font-medium opacity-80 hover:opacity-100"
                      >
                        <item.icon className={cn("w-5 h-5")} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-auto p-6 border-t border-white/5 opacity-30 text-[10px]">
                  v1.0.0 (2026)
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Add Custom Website Dialog */}
        <AnimatePresence>
          {showAddCustomDialog && (
            <div className="absolute inset-0 z-[60] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80"
                onClick={() => setShowAddCustomDialog(false)}
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={cn("relative w-full max-w-xs p-6 rounded-2xl shadow-2xl", isDark ? "bg-[#1E1E1E]" : "bg-white")}
              >
                <h3 className="text-lg font-bold mb-2">Add Custom Website</h3>
                <p className="text-xs opacity-50 mb-4">Paste website URL (e.g. https://ext.to/)</p>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="https://"
                  className={cn("w-full bg-transparent border-b py-2 text-sm outline-none mb-6", accentColor, "border-[#A3E635]")}
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                />
                <div className="flex justify-end gap-4">
                  <button onClick={() => setShowAddCustomDialog(false)} className="text-sm font-bold opacity-50">Cancel</button>
                  <button onClick={addCustomWebsite} className={cn("text-sm font-bold", accentColor)}>Add</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Test URL Dialog */}
        <AnimatePresence>
          {showTestUrlDialog && (
            <div className="absolute inset-0 z-[60] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80"
                onClick={() => setShowTestUrlDialog(false)}
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={cn("relative w-full max-w-md h-[80vh] flex flex-col p-6 rounded-2xl shadow-2xl", isDark ? "bg-[#1E1E1E]" : "bg-white")}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Test Providers</h3>
                  <button onClick={() => setShowTestUrlDialog(false)}><X className="w-5 h-5 opacity-40" /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {providers.map(p => (
                    <div key={p.name} className={cn("p-3 rounded-xl border flex items-center justify-between", isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10")}>
                      <div>
                        <p className="text-sm font-bold">{p.name}</p>
                        <p className="text-[10px] opacity-50 truncate max-w-[200px]">{p.url}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {testingStatus[p.name] === 'pending' && <RefreshCw className="w-4 h-4 animate-spin opacity-40" />}
                        {testingStatus[p.name] === 'ok' && <Check className="w-4 h-4 text-green-500" />}
                        {testingStatus[p.name] === 'failed' && (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <button 
                              onClick={() => {
                                setEditingProviderIndex(providers.indexOf(p));
                                setEditName(p.name);
                                setEditUrl(p.url);
                              }}
                              className={cn("text-[10px] font-bold px-2 py-1 rounded bg-red-500/20 text-red-500")}
                            >
                              Update
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={handleTestUrls}
                    className={cn("flex-1 py-3 rounded-xl font-bold border", accentColor, "border-[#A3E635]")}
                  >
                    Refresh
                  </button>
                  <button 
                    onClick={() => setShowTestUrlDialog(false)}
                    className={cn("flex-1 py-3 rounded-xl font-bold", accentBg, "text-black")}
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Edit Provider Dialog */}
        <AnimatePresence>
          {editingProviderIndex !== null && (
            <div className="absolute inset-0 z-[80] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90"
                onClick={() => setEditingProviderIndex(null)}
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={cn("relative w-full max-w-xs p-6 rounded-2xl shadow-2xl", isDark ? "bg-[#1E1E1E]" : "bg-white")}
              >
                <h3 className="text-lg font-bold mb-4">Update Provider</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Display Name</p>
                    <input 
                      type="text" 
                      className={cn("w-full bg-transparent border-b py-2 text-sm outline-none", accentColor, "border-[#A3E635]")}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Website URL</p>
                    <input 
                      type="text" 
                      className={cn("w-full bg-transparent border-b py-2 text-sm outline-none", accentColor, "border-[#A3E635]")}
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button onClick={() => setEditingProviderIndex(null)} className="text-sm font-bold opacity-50">Cancel</button>
                  <button 
                    onClick={() => {
                      const next = [...providers];
                      next[editingProviderIndex] = {
                        ...next[editingProviderIndex],
                        name: editName,
                        url: editUrl
                      };
                      setProviders(next);
                      setTestingStatus(prev => ({ ...prev, [editName]: 'ok' }));
                      setEditingProviderIndex(null);
                    }} 
                    className={cn("text-sm font-bold", accentColor)}
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Action Choice Menu */}
        <AnimatePresence>
          {selectedResult && (
            <div className="absolute inset-0 z-[70] flex items-end justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80"
                onClick={() => setSelectedResult(null)}
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className={cn("relative w-full max-w-md p-6 rounded-t-3xl shadow-2xl", isDark ? "bg-[#1E1E1E]" : "bg-white")}
              >
                <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6" />
                <h3 className="text-sm font-bold mb-6 line-clamp-2">{selectedResult.title}</h3>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      window.location.href = selectedResult.magnetUrl;
                      setSelectedResult(null);
                    }}
                    className={cn("w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold", accentBg, "text-black")}
                  >
                    <Download className="w-5 h-5" />
                    Open Magnet Link
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(selectedResult.magnetUrl);
                      showAlert('Copied', 'Magnet URL copied to clipboard!');
                      setSelectedResult(null);
                    }}
                    className={cn("w-full py-4 rounded-xl border flex items-center justify-center gap-3 font-bold", isDark ? "border-white/10" : "border-black/10")}
                  >
                    <Check className="w-5 h-5" />
                    Copy Magnet URL
                  </button>
                  <button 
                    onClick={() => setSelectedResult(null)}
                    className="w-full py-4 text-sm font-bold opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        {/* Custom Dialog (Alert/Confirm) */}
        <AnimatePresence>
          {dialogConfig.show && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90"
                onClick={() => setDialogConfig(prev => ({ ...prev, show: false }))}
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={cn("relative w-full max-w-xs p-6 rounded-2xl shadow-2xl", isDark ? "bg-[#1E1E1E]" : "bg-white")}
              >
                <h3 className="text-lg font-bold mb-2">{dialogConfig.title}</h3>
                <p className="text-sm opacity-60 mb-6 whitespace-pre-wrap">{dialogConfig.message}</p>
                
                <div className="flex justify-end gap-4">
                  {dialogConfig.type === 'confirm' && (
                    <button 
                      onClick={() => setDialogConfig(prev => ({ ...prev, show: false }))} 
                      className="text-sm font-bold opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      if (dialogConfig.type === 'confirm' && dialogConfig.onConfirm) {
                        dialogConfig.onConfirm();
                      }
                      setDialogConfig(prev => ({ ...prev, show: false }));
                    }} 
                    className={cn("text-sm font-bold", accentColor)}
                  >
                    {dialogConfig.type === 'confirm' ? 'Confirm' : 'OK'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
