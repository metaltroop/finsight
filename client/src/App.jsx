import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Hero from './components/Hero'
import PopularRightNow from './components/PopularRightNow'
import UsefulTools from './components/UsefulTools'
import CompareDecide from './components/CompareDecide'
import LeadAction from './components/LeadAction'
import LeadForm from './components/LeadForm'
import Footer from './components/Footer'
import GuidePost from './pages/GuidePost'
import ComparePost from './pages/ComparePost'
import LoadPullEffect from './components/LoadPullEffect'
import ScrollScale from './components/ScrollScale'

import Navbar from './components/Navbar'

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
        <ScrollScale>
            <LeadAction />
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
                <Route path="/guide/:id" element={<GuidePost />} />
                <Route path="/compare/:id" element={<ComparePost />} />
            </Routes>
        </AnimatePresence>
    )
}

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main>
                    <AnimatedRoutes />
                </main>
                <Footer />
            </div>
        </Router>
    )
}

export default App
