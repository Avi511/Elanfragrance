import { motion, AnimatePresence } from "framer-motion";
import {
    Package, Users, ShoppingBag, PlusCircle,
    ArrowUpRight, LayoutDashboard, Search, LogOut,
    DollarSign, Activity, TrendingUp, UserPlus, ShieldCheck, Mail, Lock, Phone, MapPin, MessageSquare
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [statsData, setStatsData] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalSellers: 0,
        pendingOrders: 0,
        totalOrders: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState("insights");

    const [sellerForm, setSellerForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        address: ""
    });
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const { data } = await api.get("/admin/stats");
                if (data.success) {
                    setStatsData(data.stats);
                }
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleRegisterSeller = async (e) => {
        e.preventDefault();
        const loadToast = toast.loading("Authorizing new seller access...");
        setFormLoading(true);
        try {
            await api.post("/admin/register-seller", sellerForm);
            toast.success("Seller successfully onboarded to Élan ecosystem", { id: loadToast });
            setSellerForm({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                phone: "",
                address: ""
            });
            setActiveView("insights");
            // Refresh stats
            const { data } = await api.get("/admin/stats");
            if (data.success) setStatsData(data.stats);
        } catch (error) {
            toast.error(error.response?.data?.error || "Onboarding failed", { id: loadToast });
        } finally {
            setFormLoading(false);
        }
    };

    const stats = [
        {
            label: "Total Products",
            value: statsData.totalProducts,
            icon: Package,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
        },
        {
            label: "Total Customers",
            value: statsData.totalUsers,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            label: "Verified Sellers",
            value: statsData.totalSellers,
            icon: ShieldCheck,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-24 px-4 sm:px-8 lg:px-12">

            {/* Navigation & Header */}
            <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-12">
                <div>
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-amber-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-2 block"
                    >
                        Management Console
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-serif"
                    >
                        Admin Dashboard
                    </motion.h1>
                </div>

                <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-2xl border border-zinc-900">
                    <button
                        onClick={() => setActiveView("insights")}
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeView === 'insights' ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-zinc-600 hover:text-white'}`}
                    >
                        <Activity size={14} /> Ecosystem Insights
                    </button>
                    <button
                        onClick={() => setActiveView("add-seller")}
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeView === 'add-seller' ? 'bg-amber-600 text-black shadow-xl shadow-amber-600/20' : 'text-zinc-600 hover:text-white'}`}
                    >
                        <UserPlus size={14} /> Onboard Seller
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    {activeView === "insights" ? (
                        <motion.div
                            key="insights"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {stats.map((stat, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-zinc-950 border border-zinc-900 p-8 rounded-[40px] group hover:border-zinc-700/50 transition-all duration-500 relative overflow-hidden shadow-2xl"
                                    >
                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-8">
                                                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                                                    <stat.icon className="w-6 h-6" />
                                                </div>
                                            </div>
                                            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                                            <h3 className="text-5xl font-serif tracking-tight">
                                                {loading ? "---" : stat.value}
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Operational Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                <div className="lg:col-span-3 space-y-6">
                                    <h2 className="text-xl font-serif text-white/90 flex items-center gap-3 mb-8">
                                        <LayoutDashboard className="w-5 h-5 text-amber-500" />
                                        Products and Users Management
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Link to="/admin/products" className="bg-zinc-950 border border-zinc-900 p-10 rounded-[32px] hover:border-amber-500/20 transition-all group overflow-hidden relative">
                                            <div className="relative z-10">
                                                <Package size={32} className="text-amber-500/30 group-hover:text-amber-500 mb-8 transition-all" />
                                                <h3 className="text-2xl font-serif mb-2">Inventory Control</h3>
                                                <p className="text-zinc-500 text-sm leading-relaxed">Adjust stock levels and refine product metadata with master precision.</p>
                                            </div>
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.02] rounded-full blur-3xl group-hover:bg-amber-500/[0.05] transition-all"></div>
                                        </Link>

                                        <Link to="/admin/users" className="bg-zinc-950 border border-zinc-900 p-10 rounded-[32px] hover:border-blue-500/20 transition-all group overflow-hidden relative">
                                            <div className="relative z-10">
                                                <Users size={32} className="text-blue-500/30 group-hover:text-blue-500 mb-8 transition-all" />
                                                <h3 className="text-2xl font-serif mb-2">Member Profiles</h3>
                                                <p className="text-zinc-500 text-sm leading-relaxed">Oversee client privileges and audit the platform signature system.</p>
                                            </div>
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/[0.02] rounded-full blur-3xl group-hover:bg-blue-500/[0.05] transition-all"></div>
                                        </Link>

                                        <Link to="/admin/reviews" className="bg-zinc-950 border border-zinc-900 p-10 rounded-[32px] hover:border-amber-500/20 transition-all group overflow-hidden relative">
                                            <div className="relative z-10">
                                                <MessageSquare size={32} className="text-amber-500/30 group-hover:text-amber-500 mb-8 transition-all" />
                                                <h3 className="text-2xl font-serif mb-2">Sentiment Manifest</h3>
                                                <p className="text-zinc-500 text-sm leading-relaxed">Audit customer feedback and manage the platform's public reputation.</p>
                                            </div>
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.02] rounded-full blur-3xl group-hover:bg-amber-500/[0.05] transition-all"></div>
                                        </Link>

                                        <Link to="/admin/contacts" className="bg-zinc-950 border border-zinc-900 p-10 rounded-[32px] hover:border-emerald-500/20 transition-all group overflow-hidden relative">
                                            <div className="relative z-10">
                                                <Mail size={32} className="text-emerald-500/30 group-hover:text-emerald-500 mb-8 transition-all" />
                                                <h3 className="text-2xl font-serif mb-2">Inquiry Archive</h3>
                                                <p className="text-zinc-500 text-sm leading-relaxed">Respond to global inquiries and manage concierge communications.</p>
                                            </div>
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.02] rounded-full blur-3xl group-hover:bg-emerald-500/[0.05] transition-all"></div>
                                        </Link>
                                        
                                        <Link to="/admin/orders" className="bg-zinc-950 border border-zinc-900 p-10 rounded-[32px] hover:border-emerald-500/20 transition-all group overflow-hidden relative md:col-span-2">
                                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                                <div>
                                                    <ShoppingBag size={32} className="text-emerald-500/30 group-hover:text-emerald-500 mb-8 transition-all" />
                                                    <h3 className="text-2xl font-serif mb-2">Order Management</h3>
                                                    <p className="text-zinc-500 text-sm leading-relaxed">Global logistics command. Authorize status overrides and track global fulfillment.</p>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-center">
                                                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Live Queue</p>
                                                        <p className="text-2xl font-serif text-emerald-500">{statsData.pendingOrders}</p>
                                                    </div>
                                                    <div className="w-px h-12 bg-zinc-900"></div>
                                                    <div className="text-center">
                                                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Total volume</p>
                                                        <p className="text-2xl font-serif text-white">{statsData.totalOrders}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.02] rounded-full blur-3xl group-hover:bg-emerald-500/[0.05] transition-all"></div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="add-seller"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="bg-zinc-950 border border-zinc-900 rounded-[48px] p-12 md:p-16 relative overflow-hidden shadow-[0_0_50px_-12px_rgba(245,158,11,0.05)]">
                                <div className="max-w-2xl mx-auto relative z-10">
                                    <div className="text-center mb-16">
                                        <div className="w-20 h-20 bg-amber-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-amber-500 shadow-2xl shadow-amber-500/10">
                                            <UserPlus size={32} />
                                        </div>
                                        <h2 className="text-4xl font-serif mb-4 text-white">Establish New Partnership</h2>
                                        <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
                                            Grant administrative privileges to a new verified seller within the perfumes ecosystem.
                                        </p>
                                    </div>

                                    <form onSubmit={handleRegisterSeller} className="space-y-8">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest ml-1">Legal First Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={sellerForm.firstName}
                                                    onChange={(e) => setSellerForm({ ...sellerForm, firstName: e.target.value })}
                                                    placeholder="Aravinda"
                                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-sm text-white focus:border-amber-500 focus:bg-zinc-800 outline-none transition-all placeholder:text-zinc-500 shadow-inner"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest ml-1">Legal Last Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={sellerForm.lastName}
                                                    onChange={(e) => setSellerForm({ ...sellerForm, lastName: e.target.value })}
                                                    placeholder="Fernando"
                                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-sm text-white focus:border-amber-500 focus:bg-zinc-800 outline-none transition-all placeholder:text-zinc-500 shadow-inner"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest ml-1">Corporate Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                value={sellerForm.email}
                                                onChange={(e) => setSellerForm({ ...sellerForm, email: e.target.value })}
                                                placeholder="onboarding@elanfragrance.com"
                                                className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-sm text-white focus:border-amber-500 focus:bg-zinc-800 outline-none transition-all placeholder:text-zinc-500 shadow-inner"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest ml-1">Temporary Security Signature</label>
                                            <input
                                                type="password"
                                                required
                                                value={sellerForm.password}
                                                onChange={(e) => setSellerForm({ ...sellerForm, password: e.target.value })}
                                                placeholder="••••••••"
                                                className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-sm text-white focus:border-amber-500 focus:bg-zinc-800 outline-none transition-all placeholder:text-zinc-500 shadow-inner"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest ml-1 text-center flex items-center gap-2 font-black"><Phone size={10} /> Registry Phone</label>
                                                <input
                                                    type="text"
                                                    value={sellerForm.phone}
                                                    onChange={(e) => setSellerForm({ ...sellerForm, phone: e.target.value })}
                                                    placeholder="+94 77 ..."
                                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-sm text-white focus:border-amber-500 focus:bg-zinc-800 outline-none transition-all placeholder:text-zinc-500"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest ml-1 text-center flex items-center gap-2 font-black"><MapPin size={10} /> Business HQ Address</label>
                                                <input
                                                    type="text"
                                                    value={sellerForm.address}
                                                    onChange={(e) => setSellerForm({ ...sellerForm, address: e.target.value })}
                                                    placeholder="123 Colombo St."
                                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-sm text-white focus:border-amber-500 focus:bg-zinc-800 outline-none transition-all placeholder:text-zinc-500"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={formLoading}
                                            className="w-full py-6 mt-8 bg-white text-black text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-amber-600 hover:text-white transition-all transform active:scale-95 shadow-2xl shadow-white/5 disabled:opacity-50"
                                        >
                                            {formLoading ? "Executing Authorizations..." : "Finalize Seller Contract"}
                                        </button>
                                    </form>
                                </div>
                                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/[0.03] via-transparent to-transparent pointer-events-none"></div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="py-12 border-t border-zinc-900 mt-24 text-center">
                <p className="text-zinc-800 text-[10px] font-bold uppercase tracking-[0.5em]">&copy; Élan Administrative Protocol &middot; Secure Access Level 4</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
