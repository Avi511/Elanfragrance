import { motion, AnimatePresence } from "framer-motion";
import {
    Users, ArrowLeft, Search, ShieldCheck,
    MoreVertical, Trash2, Edit3, Eye, Filter, UserX, UserCheck
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ firstName: "", lastName: "", isSeller: false, isAdmin: false });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/admin/users");
            setUsers(data);
        } catch (error) {
            toast.error("Failed to fetch member manifest.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        setUserToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        const loadToast = toast.loading("Revoking access...");
        setIsDeleteModalOpen(false);

        try {
            await api.delete(`/admin/users/${userToDelete}`);
            toast.success("Member record purged from ecosystem.", { id: loadToast });
            setUsers(users.filter(u => u._id !== userToDelete));
        } catch (error) {
            toast.error(error.response?.data?.error || "Revocation failed.", { id: loadToast });
        } finally {
            setUserToDelete(null);
        }
    };

    const handleEdit = (u) => {
        setEditingUser(u);
        setEditForm({
            firstName: u.firstName,
            lastName: u.lastName,
            isSeller: u.isSeller,
            isAdmin: u.isAdmin
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const loadToast = toast.loading("Updating signature...");
        try {
            await api.put(`/admin/users/${editingUser._id}`, editForm);
            toast.success("Signature updated successfully.", { id: loadToast });
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.error || "Update unsuccessful.", { id: loadToast });
        }
    };

    const filteredUsers = users.filter(u =>
        u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.userId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-24 px-4 sm:px-8 lg:px-12 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-xs font-black uppercase tracking-[0.3em] mb-6 block group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                        </Link>
                        <h1 className="text-5xl font-serif leading-tight">Member Manifest</h1>
                        <p className="text-zinc-400 text-sm mt-4 font-medium opacity-90">Overseeing the global Élan signature network.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-amber-500 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search manifest..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-zinc-950 border border-zinc-900 rounded-2xl pl-12 pr-6 py-4 text-sm w-full md:w-80 focus:border-amber-500 outline-none transition-all placeholder:text-zinc-800"
                            />
                        </div>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: "Total Signatures", value: users.length },
                        { label: "Verified Partners", value: users.filter(u => u.isSeller).length },
                        { label: "Admin Core", value: users.filter(u => u.isAdmin).length },
                        { label: "Network Active", value: "Primary" }
                    ].map((s, i) => (
                        <div key={i} className="bg-zinc-950 border border-zinc-900 p-8 rounded-[40px] text-center group hover:border-zinc-700/50 transition-all duration-500 relative overflow-hidden">
                            <p className="text-xs text-zinc-400 font-bold uppercase tracking-[0.3em] mb-1 relative z-10">{s.label}</p>
                            <p className="text-3xl font-serif text-white relative z-10">{s.value}</p>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] rounded-full blur-2xl group-hover:bg-white/[0.03] transition-all duration-700"></div>
                        </div>
                    ))}
                </div>

                {/* Member Matrix Row */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-[48px] overflow-hidden shadow-2xl relative">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-zinc-900 text-xs text-zinc-400 font-black uppercase tracking-[0.1em]">
                                    <th className="px-10 py-10">User ID</th>
                                    <th className="px-10 py-10">Name</th>
                                    <th className="px-10 py-10">Role</th>
                                    <th className="px-10 py-10">Register Date</th>
                                    <th className="px-10 py-10 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900/50">
                                <AnimatePresence mode="popLayout">
                                    {loading ? (
                                        [...Array(5)].map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan="5" className="px-10 py-8"><div className="h-4 bg-zinc-900/50 rounded w-full"></div></td>
                                            </tr>
                                        ))
                                    ) : filteredUsers.map((u) => (
                                        <motion.tr
                                            key={u._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="group hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-10 py-8 text-xs font-black text-zinc-400 font-mono tracking-widest">{u.userId}</td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-2xl flex items-center justify-center text-zinc-300 group-hover:text-amber-500 transition-all border border-white/5 relative overflow-hidden group/avatar">
                                                        <span className="text-sm font-serif relative z-10">{u.firstName[0]}{u.lastName[0]}</span>
                                                        <div className="absolute inset-0 bg-amber-500/0 group-hover/avatar:bg-amber-500/10 transition-all"></div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white/90">{u.firstName} {u.lastName}</p>
                                                        <p className="text-xs text-zinc-400 tracking-widest">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-3">
                                                    {u.isAdmin ? (
                                                        <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 shadow-xl shadow-amber-500/5">
                                                            <ShieldCheck size={10} /> Admin
                                                        </span>
                                                    ) : u.isSeller ? (
                                                        <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 shadow-xl shadow-emerald-500/5">
                                                            Verified Partner
                                                        </span>
                                                    ) : (
                                                        <span className="bg-zinc-900 text-zinc-300 border border-zinc-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em]">User</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-[11px] font-medium text-zinc-400">{new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex items-center justify-end gap-3 transition-opacity">
                                                    <button
                                                        className="p-3 bg-zinc-800 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-xl active:scale-95"
                                                        title="Update Permissions"
                                                        onClick={() => handleEdit(u)}
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(u._id)}
                                                        className="p-3 bg-zinc-800 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-xl active:scale-95"
                                                        title="Revoke Signature"
                                                    >
                                                        <UserX size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Edit Modal */}
                <AnimatePresence>
                    {editingUser && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setEditingUser(null)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            ></motion.div>
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                className="relative bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[48px] p-12 overflow-hidden shadow-2xl"
                            >
                                <h3 className="text-3xl font-serif mb-8">Refine Signature</h3>
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest ml-1">First Name</label>
                                            <input type="text" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-sm" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest ml-1">Last Name</label>
                                            <input type="text" value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-sm" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <label className="flex items-center gap-4 text-sm cursor-pointer group">
                                            <input type="checkbox" checked={editForm.isSeller} onChange={(e) => setEditForm({ ...editForm, isSeller: e.target.checked })} className="w-5 h-5 accent-emerald-500 rounded-lg" />
                                            <span className="text-zinc-400 group-hover:text-white transition-colors">Authorize as Verified Partner</span>
                                        </label>
                                        <label className="flex items-center gap-4 text-sm cursor-pointer group">
                                            <input type="checkbox" checked={editForm.isAdmin} onChange={(e) => setEditForm({ ...editForm, isAdmin: e.target.checked })} className="w-5 h-5 accent-amber-500 rounded-lg" />
                                            <span className="text-zinc-400 group-hover:text-white transition-colors">Elevate to Administrative Core</span>
                                        </label>
                                    </div>

                                    <div className="flex gap-4 pt-8">
                                        <button type="submit" className="flex-1 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-emerald-600 hover:text-white transition-all">Apply Changes</button>
                                        <button type="button" onClick={() => setEditingUser(null)} className="px-8 py-5 border border-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all text-zinc-600">Cancel</button>
                                    </div>
                                </form>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-3xl pointer-events-none"></div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Network Integrity Info */}
                <div className="mt-12 flex items-center justify-between text-zinc-800 text-[10px] font-bold uppercase tracking-[0.5em]">
                    <p>&copy; Élan Administrative Protocol &middot; Signature Ledger v4.0</p>
                    <p>Encrypted Payload: Yes</p>
                </div>

                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    title="Remove User"
                    message="Are you sure you want to remove this user?"
                    confirmText="Remove User"
                    cancelText="Cancel"
                />
            </div>
        </div>
    );
};

export default AdminUsers;
