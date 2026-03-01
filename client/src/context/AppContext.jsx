import { createContext, useEffect, useState } from "react";
import axios from "axios";

// Set your API base URL
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// Create context for the app
export const AppContext = createContext();

// Provider component for the app context
export const AppProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get("/api/blog/all");
            data.success ? setBlogs(data.blogs) : console.error(data.message);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const value = {
        axios,
        user,
        setUser,
        blogs,
        setBlogs,
        fetchBlogs,
    };
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
