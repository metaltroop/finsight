import React, { createContext, useContext, useState, useEffect } from 'react';

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    const [popularGuides, setPopularGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGlobalData = async () => {
        setLoading(true);
        try {
            // Fetch Blogs (Recent Top 6)
            const blogsRes = await fetch('http://localhost:3000/api/blogs');
            const blogsData = await blogsRes.json();

            if (blogsRes.ok && Array.isArray(blogsData)) {
                // Take top 6 recent blogs
                setPopularGuides(blogsData.slice(0, 6));
            } else {
                console.error("Failed to fetch global data:", blogsData);
                setError("Failed to load blogs");
            }
        } catch (err) {
            console.error("Global data fetch error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGlobalData();
    }, []);

    return (
        <GlobalContext.Provider value={{ popularGuides, loading, error, refetchGlobal: fetchGlobalData }}>
            {children}
        </GlobalContext.Provider>
    );
};
