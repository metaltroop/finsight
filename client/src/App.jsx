import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import { GlobalProvider, useGlobal } from './context/GlobalContext'
import { useState, useEffect } from 'react'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ProfileCompletionModal } from './components/ProfileCompletionModal'

// Lazy Load Pages & Components
const Hero = lazy(() => import('./components/Hero'))
const PopularRightNow = lazy(() => import('./components/PopularRightNow'))
const UsefulTools = lazy(() => import('./components/UsefulTools'))
const CompareDecide = lazy(() => import('./components/CompareDecide'))
const LeadForm = lazy(() => import('./components/LeadForm'))
const LoadPullEffect = lazy(() => import('./components/LoadPullEffect'))
const ScrollScale = lazy(() => import('./components/ScrollScale'))

const GuidePost = lazy(() => import('./pages/GuidePost'))
const ComparePost = lazy(() => import('./pages/ComparePost'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const Calculators = lazy(() => import('./pages/Calculators'))
const PrivacyPolicy = lazy(() => import('./pages/Privacy'))
const TermsConditions = lazy(() => import('./pages/Terms'))

const Home = () => (
    <LoadPullEffect interval={30000}>
        <div id="hero"><Hero /></div>
        <ScrollScale>
            <div id="popular"><PopularRightNow /></div>
        </ScrollScale>
        <ScrollScale>
            <div id="tools"><UsefulTools /></div>
        </ScrollScale>
        <ScrollScale>
            <div id="compare"><CompareDecide /></div>
        </ScrollScale>
        <div id="lead-form"><LeadForm /></div>
    </LoadPullEffect>
)

const AnimatedRoutes = () => {
    const location = useLocation()
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/calculators" element={<Calculators />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsConditions />} />
                <Route path="/guide/:id" element={<GuidePost />} />
                <Route path="/compare/:id" element={<ComparePost />} />
            </Routes>
        </AnimatePresence>
    )
}

const AppContent = () => {
    const { loading: authLoading } = useAuth();
    const { loading: globalLoading } = useGlobal();
    const [minTimeElapsed, setMinTimeElapsed] = useState(false);

    useEffect(() => {
        // Enforce minimum 2.5s loader display
        const timer = setTimeout(() => {
            setMinTimeElapsed(true);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    const isLoading = authLoading || globalLoading || !minTimeElapsed;

    if (isLoading) return <Loader />;

    return (
        <Router>
            <Suspense fallback={<Loader />}>
                <Layout />
            </Suspense>
        </Router>
    )
}

function App() {
    return (
        <AuthProvider>
            <GlobalProvider>
                <AppContent />
            </GlobalProvider>
        </AuthProvider>
    )
}

const Layout = () => {
    const location = useLocation();
    const isAuthPage = ['/login', '/register'].includes(location.pathname);
    const isAdmin = location.pathname.startsWith('/admin');
    const shouldHideNav = isAuthPage || isAdmin;

    return (
        <div className="min-h-screen bg-gray-50">
            {!shouldHideNav && <Navbar />}
            <ProfileCompletionModal />
            <main>
                <AnimatedRoutes />
            </main>
            {!shouldHideNav && <Footer />}
        </div>
    )
}



export default App
