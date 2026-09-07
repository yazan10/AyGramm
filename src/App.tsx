import React, { useState, useEffect, useLayoutEffect } from 'react';
import { AyGramProvider, useAyGram } from './context/AyGramContext';
import { ActiveView, Product } from './types/aygram';
import { Header } from './components/Header';
import { ClosedAccountScreen } from './components/ClosedAccountScreen';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { StoryViewer } from './components/StoryViewer';
import { AddStoryModal } from './components/AddStoryModal';
import { AddProductModal } from './components/AddProductModal';
import { SecretAdminModal } from './components/SecretAdminModal';
import { AuthModal } from './components/AuthModal';
import { ReportModal } from './components/ReportModal';
import { MaintenanceScreen } from './components/MaintenanceScreen';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { ToastBanner } from './components/ToastBanner';
import { AppDownloadCard } from './components/AppDownloadCard';
import { FeedbackModal } from './components/FeedbackModal';
import { HandLoadingScreen } from './components/HandLoadingScreen';
import { ChatSkeletonLoader } from './components/ChatSkeletonLoader';
import { SuggestedAccountsCard } from './components/SuggestedAccountsCard';
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  FileText,
  Award,
  MessageSquareHeart,
} from 'lucide-react';

// Separate individual pages
import {
  HomePage,
  ExplorePage,
  SearchPage,
  ShopPage,
  ChannelsPage,
  MessagesPage,
  NotificationsPage,
  SavedPage,
  ProfilePage,
  EditProfilePage,
  SettingsPage,
  RulesPage,
  SupportPage,
  BansPage,
  AdminPage,
  AuthPage,
  LandingPage,
  NotFoundPage,
} from './pages';

const FeedSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 space-y-3 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-stone-300/60"></div>
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-1/3 rounded-md bg-stone-300/60"></div>
            <div className="h-2.5 w-1/5 rounded-md bg-stone-200"></div>
          </div>
        </div>
        <div className="h-3 w-full rounded-md bg-stone-200"></div>
        <div className="h-3 w-2/3 rounded-md bg-stone-200"></div>
      </div>
    ))}
  </div>
);

const ProfileSkeleton: React.FC = () => (
  <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden animate-pulse">
    <div className="h-32 sm:h-40 bg-stone-300/60"></div>
    <div className="p-4 space-y-4">
      <div className="flex items-end justify-between -mt-9">
        <div className="w-20 h-20 rounded-full bg-stone-300/60 border-4 border-white"></div>
        <div className="w-28 h-9 rounded-xl bg-stone-300/60"></div>
      </div>
      <div className="h-4 w-1/3 rounded-md bg-stone-300/60"></div>
      <div className="h-3 w-1/2 rounded-md bg-stone-200"></div>
      <div className="h-3 w-2/3 rounded-md bg-stone-200"></div>
      <div className="flex gap-4 pt-2">
        <div className="h-8 w-24 rounded-xl bg-stone-200"></div>
        <div className="h-8 w-24 rounded-xl bg-stone-200"></div>
      </div>
    </div>
  </div>
);

const AyGramAppContent: React.FC = () => {
  const {
    currentUser,
    activeView,
    setActiveView,
    isAdminUnlocked,
    settings,
    toasts,
    dismissToast,
    showToast,
    closedAccountAttempt,
    resetClosedAccountAttempt,
  } = useAyGram();

  // Modal states
  const [isSecretAdminOpen, setIsSecretAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');
  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Hand loading screen on initial open / refresh (2.5s)
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Inline content skeletons while switching views
  const prevViewRef = React.useRef<ActiveView>(activeView);
  const [isViewLoading, setIsViewLoading] = useState(false);
  useLayoutEffect(() => {
    if (prevViewRef.current === activeView) {
      prevViewRef.current = activeView;
      return;
    }
    prevViewRef.current = activeView;
    if (activeView === 'landing' || activeView === 'auth' || activeView === 'admin') return;
    setIsViewLoading(true);
    const timer = setTimeout(() => {
      setIsViewLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [activeView]);

  // Report modal state
  const [reportData, setReportData] = useState<{
    targetId: string;
    snippet: string;
    targetType?: 'post' | 'product' | 'comment' | 'user';
  } | null>(null);

  const openAuth = (_mode: 'login' | 'signup' = 'login') => {
    setAuthInitialMode(_mode);
    setActiveView('auth');
  };

  const handleOpenReport = (
    targetId: string,
    snippet: string,
    targetType: 'post' | 'product' | 'comment' | 'user' = 'post'
  ) => {
    setReportData({ targetId, snippet, targetType });
  };

  // If site is in maintenance mode and user is not admin
  if (settings.maintenanceMode && !isAdminUnlocked) {
    return <MaintenanceScreen />;
  }

  const popularTags: { tag: string; count: string }[] = [
    { tag: 'aygram', count: '1.2K' },
    { tag: 'برمجة', count: '850' },
    { tag: 'تصميم_عربي', count: '620' },
    { tag: 'سوق_المبدعين', count: '430' },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#FCF9F0] text-[#1A1A1A] flex flex-col font-['IBM_Plex_Sans_Arabic'] selection:bg-[#D4AF37]/30 selection:text-[#0F3D2E] overflow-x-clip">
      
      {/* Closed account warning screen */}
      {closedAccountAttempt && (
        <ClosedAccountScreen
          user={closedAccountAttempt}
          onBackToLogin={() => {
            resetClosedAccountAttempt();
            openAuth('login');
          }}
        />
      )}

      {/* Top Sticky Header */}
      <Header
        onOpenSecretAdmin={() => setIsSecretAdminOpen(true)}
        onOpenAuth={() => openAuth('login')}
        onOpenAddProduct={() => setIsAddProductOpen(true)}
      />

      {/* Community Announcement Notice Banner */}
      {settings.siteNotice && activeView !== 'admin' && activeView !== 'landing' && (
        <div className="bg-[#0F3D2E] text-[#D4AF37] py-2 px-4 text-center text-xs font-medium border-b border-[#D4AF37]/30 shadow-xs flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate max-w-4xl">{settings.siteNotice}</span>
          <Sparkles className="w-3.5 h-3.5 shrink-0 hidden sm:inline" />
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 w-full mx-auto app-shell">
        
        {/* Full-width independent pages */}
        {activeView === 'landing' ? (
          <LandingPage />
        ) : activeView === 'auth' ? (
          <AuthPage />
        ) : activeView === 'admin' ? (
          <AdminPage />
        ) : (
          /* Standard 3-column Layout for content pages */
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-7 flex gap-6 items-start justify-center">
            
            {/* Desktop Left Navigation Sidebar */}
            <Sidebar
              onOpenAuth={() => openAuth('login')}
              onOpenAddProduct={() => setIsAddProductOpen(true)}
            />

            {/* Central Page View Area (Each page separated independently) */}
            <div className={`flex-1 max-w-2xl w-full space-y-4 ${currentUser ? 'pb-24 lg:pb-8 mobile-safe-bottom' : 'pb-8'}`}>
              
              {isViewLoading ? (
                activeView === 'messages' || activeView === 'notifications' ? (
                  <ChatSkeletonLoader count={5} />
                ) : activeView === 'profile' || activeView === 'settings' || activeView === 'edit_profile' ? (
                  <ProfileSkeleton />
                ) : (
                  <FeedSkeleton />
                )
              ) : (
                <>
                  {activeView === 'home' && (
                    <HomePage
                      onOpenAddStory={() => {
                        if (!currentUser) openAuth('login');
                        else setIsAddStoryOpen(true);
                      }}
                      onOpenReport={handleOpenReport}
                    />
                  )}

                  {activeView === 'explore' && (
                    <ExplorePage onOpenReport={handleOpenReport} />
                  )}

                  {activeView === 'search' && (
                    <SearchPage onOpenReport={handleOpenReport} />
                  )}

                  {activeView === 'shop' && (
                    <ShopPage
                      onOpenAddProduct={() => {
                        setEditingProduct(null);
                        setIsAddProductOpen(true);
                      }}
                      onEditProduct={(product) => {
                        setEditingProduct(product);
                        setIsAddProductOpen(true);
                      }}
                      onOpenReport={handleOpenReport}
                    />
                  )}

                  {activeView === 'channels' && (
                    <ChannelsPage />
                  )}

                  {activeView === 'messages' && (
                    <MessagesPage />
                  )}

                  {activeView === 'notifications' && (
                    <NotificationsPage />
                  )}

                  {activeView === 'saved' && (
                    <SavedPage onOpenReport={handleOpenReport} />
                  )}

                  {activeView === 'profile' && (
                    <ProfilePage onOpenReport={handleOpenReport} />
                  )}

                  {activeView === 'edit_profile' && (
                    <EditProfilePage />
                  )}

                  {activeView === 'settings' && (
                    <SettingsPage />
                  )}

                  {activeView === 'rules' && (
                    <RulesPage />
                  )}

                  {activeView === 'bans' && (
                    <BansPage />
                  )}

                  {activeView === 'support' && (
                    <SupportPage />
                  )}

                  {activeView === 'not_found' && (
                    <NotFoundPage />
                  )}
                </>
              )}
            </div>

            {/* Desktop Right Info / Widgets Column */}
            <aside className="hidden xl:flex flex-col gap-5 w-72 shrink-0 select-none">
              
              {/* Community Values Card */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-[#0F3D2E] font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>معايير مجتمع AyGram</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  بيئة تواصل آمنة تحمي الخصوصية، تمنع الروابط المضللة والمحتوى المزعج، وتمنحك تجربة تدوين رقمية نقية وسريعة.
                </p>
                <button
                  onClick={() => setActiveView('rules')}
                  className="text-xs text-[#0F3D2E] hover:text-[#D4AF37] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>شروط وقوانين المنصة</span>
                </button>
              </div>

              {/* Trending Tags */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-[#0F3D2E] font-bold text-xs">
                  <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                  <span>الوسوم الأكثر تداولاً</span>
                </div>
                <div className="space-y-2">
                  {popularTags.map((item) => (
                    <div
                      key={item.tag}
                      onClick={() => setActiveView('search')}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 cursor-pointer transition-colors text-xs"
                    >
                      <span className="font-bold text-[#0F3D2E]">#{item.tag}</span>
                      <span className="text-[10px] text-stone-400 font-mono">{item.count} مشاركة</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Accounts Widget */}
              <SuggestedAccountsCard onOpenAuth={() => openAuth('login')} />

              {/* Feedback & Platform Rating Card */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-2.5">
                <div className="flex items-center gap-2 text-[#0F3D2E] font-bold text-xs">
                  <MessageSquareHeart className="w-4 h-4 text-[#D4AF37]" />
                  <span>رأيك يهمنا ويطور AyGram</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  شاركنا تجربتك وملاحظاتك مع تقييمك بالنجوم لنواصل تحسين وتطوير المنصة.
                </p>
                <button
                  onClick={() => setIsFeedbackOpen(true)}
                  className="w-full py-2.5 px-3 bg-[#0F3D2E]/10 hover:bg-[#0F3D2E] text-[#0F3D2E] hover:text-[#D4AF37] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#0F3D2E]/20"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>أرسل ملاحظاتك وتقييمك</span>
                </button>
              </div>

              {/* App Download Card */}
              <AppDownloadCard
                onNotifySoon={() =>
                  showToast(
                    'تطبيق AyGram قيد التطوير والعمل وسيتوفر قريباً على Google Play و App Store!',
                    'info'
                  )
                }
              />

              {/* Ownership & Footer Links */}
              <div className="p-3 bg-white rounded-2xl border border-stone-200 space-y-2 text-[11px] text-stone-500">
                <div className="flex items-center gap-1.5 text-stone-800 font-bold">
                  <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>المالك والمطور: يزن السلاق</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1 border-t border-stone-100 text-[10px]">
                  <button onClick={() => setActiveView('rules')} className="hover:underline cursor-pointer">
                    الشروط والقوانين
                  </button>
                  {(isAdminUnlocked || currentUser?.role === 'admin') && (
                    <>
                      <span>•</span>
                      <button onClick={() => setActiveView('bans')} className="hover:underline text-red-600 cursor-pointer">
                        سجل الحظر (إشراف)
                      </button>
                    </>
                  )}
                  <span>•</span>
                  <span>© {new Date().getFullYear()} AyGram</span>
                </div>
              </div>

            </aside>

          </div>
        )}

      </main>

      {/* Site Footer */}
      <Footer />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />

      {/* Mobile Bottom Navigation Bar */}
      {currentUser && <BottomNav onOpenAuth={() => openAuth('login')} />}

      {/* Fullscreen Story Viewer */}
      <StoryViewer />

      {/* Add Story Modal */}
      <AddStoryModal
        isOpen={isAddStoryOpen}
        onClose={() => setIsAddStoryOpen(false)}
      />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => {
          setIsAddProductOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
      />

      {/* Secret Admin Modal (Triggered by 6 clicks on logo) */}
      <SecretAdminModal
        isOpen={isSecretAdminOpen}
        onClose={() => setIsSecretAdminOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authInitialMode}
      />

      {/* Report Modal */}
      {reportData && (
        <ReportModal
          isOpen={true}
          onClose={() => setReportData(null)}
          targetId={reportData.targetId}
          targetSnippet={reportData.snippet}
          targetType={reportData.targetType}
        />
      )}

      {/* Toast Notifications */}
      <ToastBanner toasts={toasts} onDismiss={dismissToast} />

      {/* User Feedback & Star Rating Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* Hand loading screen — only on initial open / refresh */}
      <HandLoadingScreen
        isLoading={isInitialLoading}
        label="جاري إطلاق منصة AyGram..."
      />

    </div>
  );
};

export default function App() {
  return (
    <AyGramProvider>
      <AyGramAppContent />
    </AyGramProvider>
  );
}
