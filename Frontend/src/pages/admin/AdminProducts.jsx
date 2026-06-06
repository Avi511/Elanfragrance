import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Search, Trash2, Edit3, Eye, Filter
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const AdminProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState({ productName: "", productPrice: 0, productQuantity: 0 });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const { data } = await api.get("/admin/products");
                setProducts(data);
            } catch (error) {
                toast.error("Failed to load products.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleDelete = (id) => {
        setProductToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;

        const loadToast = toast.loading("Deleting product...");
        setIsDeleteModalOpen(false);

        try {
            await api.delete(`/admin/products/${productToDelete}`);
            toast.success("Product deleted.", { id: loadToast });
            setProducts(products.filter(p => p._id !== productToDelete));
        } catch (error) {
            toast.error("Delete failed. Check permissions.", { id: loadToast });
        } finally {
            setProductToDelete(null);
        }
    };

    const filteredProducts = products.filter(p =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.productId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (p) => {
        setEditingProduct(p);
        setEditForm({
            productName: p.productName,
            productPrice: p.productPrice,
            productQuantity: p.productQuantity
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const loadToast = toast.loading("Updating product...");
        try {
            await api.put(`/admin/products/${editingProduct._id}`, editForm);
            toast.success("Product updated successfully.", { id: loadToast });
            setEditingProduct(null);
            // Refresh products
            const { data } = await api.get("/admin/products");
            setProducts(data);
        } catch (error) {
            toast.error(error.response?.data?.error || "Update failed.", { id: loadToast });
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-24 px-4 sm:px-8 lg:px-12 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-xs font-black uppercase tracking-[0.3em] mb-6 mb-8 group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                        </Link>
                        <h1 className="text-5xl font-serif leading-tight">Product Management</h1>
                        <p className="text-zinc-400 text-sm mt-4 font-medium opacity-90">Manage all products here.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-amber-500 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-zinc-950 border border-zinc-900 rounded-2xl pl-12 pr-6 py-4 text-sm w-full md:w-80 focus:border-amber-500 outline-none transition-all placeholder:text-zinc-800"
                            />
                        </div>
                        <button className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl text-zinc-500 hover:text-white transition-all shadow-xl">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {/* Statistics Banner */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: "Total Products", value: products.length },
                        { label: "Low Stock", value: products.filter(p => p.productQuantity < 5).length },
                        { label: "Expensive Products", value: products.filter(p => p.productPrice > 20000).length },
                        { label: "System Status", value: "Verified" }
                    ].map((s, i) => (
                        <div key={i} className="bg-zinc-950 border border-zinc-900 p-6 rounded-[32px] text-center">
                            <p className="text-xs text-zinc-400 font-bold uppercase tracking-[0.2em] mb-1">{s.label}</p>
                            <p className="text-xl font-serif text-white">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Products Table */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-[48px] overflow-hidden shadow-2xl relative">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-zinc-900 text-xs text-zinc-400 font-black uppercase tracking-[0.3em]">
                                    <th className="px-10 py-8">Product ID</th>
                                    <th className="px-10 py-8">Product</th>
                                    <th className="px-10 py-8">Price</th>
                                    <th className="px-10 py-8">Stock</th>
                                    <th className="px-10 py-8">Status</th>
                                    <th className="px-10 py-8 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900/50">
                                <AnimatePresence mode="popLayout">
                                    {loading ? (
                                        [...Array(5)].map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan="6" className="px-10 py-6"><div className="h-4 bg-zinc-900/50 rounded w-full"></div></td>
                                            </tr>
                                        ))
                                    ) : filteredProducts.map((p) => (
                                        <motion.tr
                                            key={p._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="group hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-10 py-6 text-xs font-black text-zinc-400 font-mono tracking-widest">{p.productId}</td>
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-zinc-900 rounded-xl overflow-hidden border border-white/5">
                                                        <img
                                                            src={p.productImage && (p.productImage.startsWith('http') || p.productImage.startsWith('data:'))
                                                                 ? p.productImage
                                                                 : (p.productImage ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${p.productImage}` : "/images/sample.jpg")}
                                                            alt=""
                                                            className="w-full h-full object-cover transition-all duration-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white/90">{p.productName}</p>
                                                        <p className="text-xs text-zinc-400 uppercase tracking-widest">Product List</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-sm font-medium font-serif">Rs. {p.productPrice.toLocaleString()}</td>
                                            <td className="px-10 py-6">
                                                <span className={`text-xs font-bold ${p.productQuantity < 10 ? 'text-amber-500' : 'text-zinc-300'}`}>
                                                    {p.productQuantity} Left
                                                </span>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">Available</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2 transition-opacity">
                                                    <button className="p-3 bg-zinc-800 hover:bg-amber-600 hover:text-white rounded-xl transition-all" title="View">
                                                        <Eye size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEdit(p)}
                                                        className="p-3 bg-zinc-800 hover:bg-white hover:text-black rounded-xl transition-all" 
                                                        title="Edit Product"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(p._id)}
                                                        className="p-3 bg-zinc-800 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                                                        title="Delete Product"
                                                    >
                                                        <Trash2 size={14} />
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

                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    title="Confirm Delete"
                    message="Are you sure you want to delete this product? This cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                />

                {/* Edit Modal */}
                <AnimatePresence>
                    {editingProduct && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setEditingProduct(null)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            ></motion.div>
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                className="relative bg-zinc-950 border border-zinc-900 w-full max-w-lg rounded-[48px] p-12 overflow-hidden shadow-2xl"
                            >
                                <h3 className="text-3xl font-serif mb-8 text-white">Edit Product</h3>
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div className="space-y-1">
                                        <label className="text-xs text-zinc-400 font-bold uppercase tracking-widest ml-1">Product Name</label>
                                        <input 
                                            type="text" 
                                            value={editForm.productName} 
                                            onChange={(e) => setEditForm({ ...editForm, productName: e.target.value })} 
                                            className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-amber-500 outline-none transition-all" 
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-zinc-400 font-bold uppercase tracking-widest ml-1">Price (Rs.)</label>
                                            <input 
                                                type="number" 
                                                value={editForm.productPrice} 
                                                onChange={(e) => setEditForm({ ...editForm, productPrice: e.target.value })} 
                                                className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-emerald-500 outline-none transition-all" 
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-zinc-400 font-bold uppercase tracking-widest ml-1">Stock Quantity</label>
                                            <input 
                                                type="number" 
                                                value={editForm.productQuantity} 
                                                onChange={(e) => setEditForm({ ...editForm, productQuantity: e.target.value })} 
                                                className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-amber-500 outline-none transition-all" 
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-8">
                                        <button type="submit" className="flex-1 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-emerald-600 hover:text-white transition-all">Save Changes</button>
                                        <button type="button" onClick={() => setEditingProduct(null)} className="px-8 py-5 border border-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all text-zinc-400">Cancel</button>
                                    </div>
                                </form>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-3xl pointer-events-none"></div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminProducts;