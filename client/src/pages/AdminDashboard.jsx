import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminDashboard = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const [activeView, setActiveView] = React.useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const [toast, setToast] = React.useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    React.useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate('/login');
            } else if (user.role !== 'admin') {
                navigate('/');
            }
        }
    }, [user, loading, navigate]);

    if (loading || !user) return null;

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: isSidebarOpen ? 260 : 0, opacity: isSidebarOpen ? 1 : 0 }}
                className="bg-gray-900 text-white flex-shrink-0 h-screen sticky top-0 overflow-hidden"
            >
                <div className="p-6">
                    <h1 className="text-2xl font-bold tracking-tight text-teal-400">AdminPanel.</h1>
                    <p className="text-xs text-gray-500 mt-1">v2.0 Management System</p>
                </div>

                <nav className="mt-6 px-4 space-y-2">
                    <SidebarItem icon="📊" label="Overview" active={activeView === 'overview'} onClick={() => setActiveView('overview')} />
                    <SidebarItem icon="👥" label="Users" active={activeView === 'users'} onClick={() => setActiveView('users')} />
                    <SidebarItem icon="📝" label="Blog Manager" active={activeView === 'blogs'} onClick={() => setActiveView('blogs')} />
                    <SidebarItem icon="📈" label="Leads Data" active={activeView === 'leads'} onClick={() => setActiveView('leads')} />
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
                    <button onClick={logout} className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors w-full px-4 py-3 rounded-lg hover:bg-white/5">
                        <span>🚪</span> Sign Out
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-auto">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-4 flex items-center justify-between">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500 uppercase">{user.role}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border-2 border-white shadow-sm">
                            {user.name.charAt(0)}
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeView === 'overview' && <OverviewStats user={user} />}
                            {activeView === 'users' && <UsersManager showToast={showToast} />}
                            {activeView === 'blogs' && <BlogManager showToast={showToast} />}
                            {activeView === 'leads' && <LeadsManager showToast={showToast} />}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {toast && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, x: '-50%' }}
                            animate={{ opacity: 1, y: 0, x: '-50%' }}
                            exit={{ opacity: 0, y: 20, x: '-50%' }}
                            className={`fixed bottom-8 left-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-semibold text-white ${toast.type === 'error' ? 'bg-red-500' : 'bg-teal-600'}`}
                        >
                            <span>{toast.type === 'error' ? '❌' : '✅'}</span>
                            {toast.message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

// Sub-components for cleaner code
const SidebarItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${active ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
    >
        <span>{icon}</span>
        {label}
    </button>
);

const OverviewStats = ({ user }) => {
    const [stats, setStats] = React.useState({ users: 0, blogs: 0, leads: 0 });
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const fetchStats = async () => {
        setIsRefreshing(true);
        try {
            const res = await fetch('http://localhost:3000/api/admin/stats', {
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (e) { console.error(e); }
        finally { setIsRefreshing(false); }
    };

    React.useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                    <p className="text-sm text-gray-500 mt-1">Hello {user.name}, here is what's happening today.</p>
                </div>
                <button
                    onClick={fetchStats}
                    disabled={isRefreshing}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isRefreshing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm'}`}
                >
                    {isRefreshing ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Refreshing...
                        </>
                    ) : (
                        <>
                            <span>🔄</span> Refresh Data
                        </>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 text-xl">👥</div>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Users</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{stats.users}</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-4 text-xl">📝</div>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Published Blogs</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{stats.blogs}</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 text-xl">📈</div>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Leads Collected</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{stats.leads}</h3>
                </div>
            </div>
        </div>
    );
};

const LeadsManager = ({ showToast }) => {
    const [leads, setLeads] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [exporting, setExporting] = React.useState(false);
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const fetchLeads = async () => {
        setIsRefreshing(true);
        try {
            const res = await fetch('http://localhost:3000/api/leads', { credentials: 'include' });
            const data = await res.json();
            setLeads(data);
        } catch (error) { console.error(error); }
        finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    React.useEffect(() => { fetchLeads() }, []);

    const handleExport = async () => {
        setExporting(true);
        try {
            const response = await fetch('http://localhost:3000/api/leads/export', { method: 'GET', credentials: 'include' });
            if (!response.ok) throw new Error('Export failed');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'leads_export.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            showToast('Leads exported successfully!');
        } catch (error) {
            showToast('Failed to download leads.', 'error');
        } finally { setExporting(false); }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Lead Management</h2>
                <div className="flex gap-3">
                    <button
                        onClick={fetchLeads}
                        disabled={isRefreshing}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isRefreshing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm'}`}
                    >
                        {isRefreshing ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Refreshing...
                            </>
                        ) : (
                            <>
                                <span>🔄</span> Refresh
                            </>
                        )}
                    </button>
                    <button
                        disabled={exporting}
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-900/10 hover:bg-teal-700 transition-all disabled:opacity-50"
                    >
                        {exporting ? '⏳ Exporting...' : '📥 Export to Excel'}
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">City</th>
                                <th className="px-6 py-3">Mobile</th>
                                <th className="px-6 py-3">Income</th>
                                <th className="px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-4 text-center">No leads found</td></tr>
                            ) : leads.map(lead => (
                                <tr key={lead.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{lead.fullName}</td>
                                    <td className="px-6 py-4">{lead.city}</td>
                                    <td className="px-6 py-4">{lead.mobile}</td>
                                    <td className="px-6 py-4">{lead.income}</td>
                                    <td className="px-6 py-4">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};

const UsersManager = () => {
    const [users, setUsers] = React.useState([]);
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const fetchUsers = async () => {
        setIsRefreshing(true);
        try {
            const res = await fetch('http://localhost:3000/api/users', { credentials: 'include' });
            const data = await res.json();
            setUsers(data);
        } catch (error) { console.error(error); }
        finally { setIsRefreshing(false); }
    };

    React.useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                <button
                    onClick={fetchUsers}
                    disabled={isRefreshing}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isRefreshing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm'}`}
                >
                    {isRefreshing ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Refreshing...
                        </>
                    ) : (
                        <>
                            <span>🔄</span> Refresh
                        </>
                    )}
                </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Income Range</th>
                                <th className="px-6 py-3">Verified</th>
                                <th className="px-6 py-3">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-4 text-center">No users found</td></tr>
                            ) : users.map(user => (
                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-400">{user.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {user.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{user.incomeRange || '-'}</td>
                                    <td className="px-6 py-4">{user.isVerified ? '✅' : '❌'}</td>
                                    <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const BlogManager = ({ showToast }) => {
    const [blogs, setBlogs] = React.useState([]);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    // State now includes file object and preview URL separate from the data field if needed,
    // but here we can just manage a separate 'imageFile' state or mix it.
    // Let's keep it simple: newBlog has metadata. We add a separate state for the actual file object if needed, 
    // or just store it in newBlog.imageFile 
    const [newBlog, setNewBlog] = React.useState({
        title: '', slug: '', excerpt: '', content: '', coverImage: '', tags: '', imageFile: null, previewUrl: ''
    });
    const [loading, setLoading] = React.useState(false);
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);

    React.useEffect(() => { fetchBlogs() }, []);

    const fetchBlogs = async () => {
        setIsRefreshing(true);
        try {
            const res = await fetch('http://localhost:3000/api/blogs', { credentials: 'include' });
            const data = await res.json();
            setBlogs(data);
        } catch (error) { console.error(error); }
        finally { setIsRefreshing(false); }
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', newBlog.title);
            formData.append('slug', newBlog.slug);
            formData.append('excerpt', newBlog.excerpt);
            formData.append('content', newBlog.content);
            formData.append('tags', newBlog.tags); // Handle splitting on server or send as string and let server parse, or just send text

            // If imageFile exists, append it. 'image' is the field name expected by multer on server
            if (newBlog.imageFile) {
                formData.append('image', newBlog.imageFile);
            } else if (newBlog.coverImage) {
                // Keep existing image if no new file
                formData.append('coverImage', newBlog.coverImage);
            }

            const url = editingId
                ? `http://localhost:3000/api/blogs/${editingId}`
                : 'http://localhost:3000/api/blogs';

            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                // Content-Type header not needed for FormData, browser sets it with boundary
                credentials: 'include',
                body: formData
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Failed to save blog');
            }

            setNewBlog({ title: '', slug: '', excerpt: '', content: '', coverImage: '', tags: '', imageFile: null, previewUrl: '' });
            setIsFormOpen(false);
            setEditingId(null);
            showToast(editingId ? 'Blog updated successfully!' : 'Blog published successfully!');
            fetchBlogs();
        } catch (e) { showToast(e.message, 'error'); } finally { setLoading(false); }
    };

    const handleEditClick = (blog) => {
        setNewBlog({
            ...blog,
            tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags || '',
            imageFile: null,
            previewUrl: blog.coverImage
        });
        setEditingId(blog.id);
        setIsFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const togglePopular = async (id) => {
        try {
            await fetch(`http://localhost:3000/api/blogs/${id}/toggle-popular`, { method: 'PUT', credentials: 'include' });
            showToast('Popular status updated');
            fetchBlogs();
        } catch (e) { showToast('Failed to update status', 'error'); }
    };

    const deleteBlog = async (id) => {
        if (confirm('Are you sure you want to delete this blog?')) {
            try {
                await fetch(`http://localhost:3000/api/blogs/${id}`, { method: 'DELETE', credentials: 'include' });
                showToast('Blog deleted');
                fetchBlogs();
            } catch (e) { showToast('Failed to delete blog', 'error'); }
        }
    };

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your guides and articles</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchBlogs}
                        disabled={isRefreshing}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isRefreshing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm'}`}
                    >
                        {isRefreshing ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Refreshing...
                            </>
                        ) : (
                            <>
                                <span>🔄</span> Refresh List
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => {
                            if (isFormOpen && editingId) {
                                // If closing edit mode, reset form
                                setNewBlog({ title: '', slug: '', excerpt: '', content: '', coverImage: '', tags: '', imageFile: null, previewUrl: '' });
                                setEditingId(null);
                                setIsFormOpen(false);
                            } else {
                                setIsFormOpen(!isFormOpen);
                            }
                        }}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${isFormOpen ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/20'}`}
                    >
                        {isFormOpen ? 'Cancel' : '✨ New Post'}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isFormOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50 mb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">
                                {editingId ? 'Edit Guide' : 'Create New Guide'}
                            </h3>
                            <form onSubmit={handleCreateOrUpdate} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Title</label>
                                            <input required placeholder="E.g. Ultimate Tax Guide 2024" className="input-field text-lg" value={newBlog.title} onChange={e => setNewBlog({ ...newBlog, title: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Slug</label>
                                            <input required placeholder="ultimate-tax-guide-2024" className="input-field font-mono text-sm bg-gray-50 from-gray-50" value={newBlog.slug} onChange={e => setNewBlog({ ...newBlog, slug: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Tags</label>
                                            <input placeholder="Tax, Finance, Savings" className="input-field" value={newBlog.tags} onChange={e => setNewBlog({ ...newBlog, tags: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-semibold text-gray-700">Cover Image</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors group relative bg-gray-50/50">
                                            {newBlog.previewUrl ? (
                                                <>
                                                    <img src={newBlog.previewUrl} alt="Preview" className="h-32 w-full object-cover rounded-lg mb-3 shadow-sm" />
                                                    <button type="button" onClick={() => setNewBlog({ ...newBlog, imageFile: null, previewUrl: '', coverImage: '' })} className="text-xs text-red-500 hover:text-red-600 font-semibold bg-white px-2 py-1 rounded shadow-sm border border-gray-200 z-20 relative">Remove</button>
                                                </>
                                            ) : (
                                                <>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (!file) return;
                                                            // Create local preview
                                                            const objectUrl = URL.createObjectURL(file);
                                                            setNewBlog({ ...newBlog, imageFile: file, previewUrl: objectUrl });
                                                        }}
                                                    />
                                                    <div className="space-y-2 pointer-events-none">
                                                        <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                                            📁
                                                        </div>
                                                        <p className="text-xs text-gray-500">
                                                            <span className="text-teal-600 font-semibold">
                                                                Upload a file
                                                            </span>
                                                            {' '}or drag and drop
                                                        </p>
                                                        <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Short Summary</label>
                                    <textarea required rows="2" className="input-field" value={newBlog.excerpt} onChange={e => setNewBlog({ ...newBlog, excerpt: e.target.value })} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex justify-between">
                                        Content
                                        <span className="text-xs font-normal text-gray-400">Word-like Editor Enabled</span>
                                    </label>
                                    <div className="prose-editor-wrapper">
                                        <ReactQuill
                                            theme="snow"
                                            value={newBlog.content}
                                            onChange={content => setNewBlog({ ...newBlog, content })}
                                            modules={quillModules}
                                            className="bg-white rounded-xl overflow-hidden"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsFormOpen(false);
                                            setEditingId(null);
                                            setNewBlog({ title: '', slug: '', excerpt: '', content: '', coverImage: '', tags: '', imageFile: null, previewUrl: '' });
                                        }}
                                        className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button disabled={loading} type="submit" className="px-8 py-2.5 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-700/20 transition-all transform hover:-translate-y-0.5">
                                        {loading ? 'Saving...' : (editingId ? 'Update Guide' : 'Publish Guide')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {blogs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-bold text-gray-900">No blogs published yet</h3>
                    <p className="text-gray-500 mt-2">Create your first guide to start helping users.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map(blog => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={blog.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
                        >
                            <div className="relative h-48 bg-gray-100 overflow-hidden">
                                <img src={blog.coverImage || 'https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image'} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-3 right-3 flex gap-2">
                                    {blog.isPopular && <span className="px-2 py-1 bg-amber-400 text-white text-xs font-bold rounded-lg shadow-sm">★ POPULAR</span>}
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex-1">
                                    <h4 className="font-bold text-lg text-gray-900 leading-snug mb-2 line-clamp-2">{blog.title}</h4>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{blog.excerpt}</p>
                                </div>

                                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-400">{new Date(blog.createdAt).toLocaleDateString()}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => togglePopular(blog.id)}
                                            className={`p-2 rounded-lg transition-colors ${blog.isPopular ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-gray-400 hover:text-amber-500 hover:bg-gray-50'}`}
                                            title="Toggle Popular"
                                        >
                                            ★
                                        </button>
                                        <button
                                            onClick={() => handleEditClick(blog)}
                                            className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => deleteBlog(blog.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <style>{`
                .input-field { width: 100%; padding: 0.875rem; border-radius: 0.75rem; border: 1px solid #e5e7eb; outline: none; transition: all 0.2s; background-color: white; }
                .input-field:focus { border-color: #0d9488; ring: 3px solid #0d948815; }
                
                /* React Quill Modern Overrides */
                .prose-editor-wrapper .ql-toolbar {
                    border: 1px solid #e5e7eb;
                    border-bottom: none;
                    border-top-left-radius: 0.75rem;
                    border-top-right-radius: 0.75rem;
                    background-color: #f9fafb;
                    padding: 12px;
                }
                .prose-editor-wrapper .ql-container {
                    border: 1px solid #e5e7eb;
                    border-bottom-left-radius: 0.75rem;
                    border-bottom-right-radius: 0.75rem;
                    background-color: white;
                    font-family: inherit;
                    min-height: 300px;
                }
                .prose-editor-wrapper .ql-editor {
                    padding: 24px;
                    font-size: 1rem;
                    line-height: 1.75;
                    min-height: 300px;
                }
                .prose-editor-wrapper .ql-editor.ql-blank::before {
                    font-style: normal;
                    color: #9ca3af;
                }
                .prose-editor-wrapper .ql-editor table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 1em 0;
                }
                .prose-editor-wrapper .ql-editor table td, 
                .prose-editor-wrapper .ql-editor table th {
                    border: 1px solid #e5e7eb;
                    padding: 8px 12px;
                }
                .prose-editor-wrapper .ql-editor table th {
                    background-color: #f9fafb;
                    font-weight: 600;
                }
                .prose-editor-wrapper .ql-editor img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.5rem;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
