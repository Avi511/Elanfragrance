import React, { useState, useRef } from "react";
import { X, Upload, Zap, Sparkles, Flame, Plus, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import toast from "react-hot-toast";

const AddProductModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    
    const [formData, setFormData] = useState({
        productName: "",
        productPrice: "",
        productQuantity: "",
        gender: "Unisex",
        fragranceFamily: "Floral",
        occasion: "Everyday / Office",
        season: "All-season",
        priceRange: "Mid-range",
        longevity: "Moderate",
        isNewArrival: false,
        isBestSeller: false,
        isTrending: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size must be less than 5MB");
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            toast.error("Please provide a visual for your masterpiece");
            return;
        }

        setLoading(true);
        try {
            const dataToSend = new FormData();
            
            // Append binary file
            dataToSend.append("image", selectedFile);
            
            // Append other fields
            Object.keys(formData).forEach(key => {
                dataToSend.append(key, formData[key]);
            });

            const { data } = await api.post("/products", dataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success("Masterwork successfully onboarded");
            onSuccess(data);
            handleClose();
        } catch (error) {
            console.error("Failed to add product:", error);
            toast.error(error.response?.data?.error || "Failed to onboard creation");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            productName: "",
            productPrice: "",
            productQuantity: "",
            gender: "Unisex",
            fragranceFamily: "Floral",
            occasion: "Everyday / Office",
            season: "All-season",
            priceRange: "Mid-range",
            longevity: "Moderate",
            isNewArrival: false,
            isBestSeller: false,
            isTrending: false
        });
        setSelectedFile(null);
        setImagePreview(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                />
                
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-900 rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
                        <div>
                            <h2 className="text-2xl font-serif text-white mb-1">Onboard New Creation</h2>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Define your olfactory masterpiece</p>
                        </div>
                        <button 
                            onClick={handleClose}
                            className="p-3 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            
                            {/* Image Upload Column */}
                            <div className="lg:col-span-5 space-y-6">
                                <h3 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Visual Identity
                                </h3>
                                
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative aspect-[4/5] rounded-[32px] border-2 border-dashed transition-all duration-500 group cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-4
                                        ${imagePreview 
                                            ? 'border-transparent bg-zinc-900' 
                                            : 'border-zinc-800 bg-zinc-900/30 hover:border-amber-500/50 hover:bg-amber-500/5'}`}
                                >
                                    {imagePreview ? (
                                        <>
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Upload className="text-white w-8 h-8" />
                                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Replace Masterwork</span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center text-center p-8">
                                            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800 group-hover:border-amber-500/50 transition-all group-hover:scale-110">
                                                <ImageIcon className="text-zinc-500 group-hover:text-amber-500 transition-colors" size={32} />
                                            </div>
                                            <p className="text-sm text-zinc-400 font-medium mb-1">Click to reveal asset</p>
                                            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Supports PNG, JPG, WEBP (Max 5MB)</p>
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden" 
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            {/* Data Columns */}
                            <div className="lg:col-span-7 space-y-10">
                                <div className="space-y-8">
                                    <h3 className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Essential Specifications
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="col-span-1 md:col-span-2 space-y-2">
                                            <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold ml-1">Product Name</label>
                                            <input
                                                required
                                                name="productName"
                                                value={formData.productName}
                                                onChange={handleChange}
                                                placeholder="e.g. Midnight Oud"
                                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold ml-1">Price (Rs.)</label>
                                            <input
                                                required
                                                type="number"
                                                name="productPrice"
                                                value={formData.productPrice}
                                                onChange={handleChange}
                                                placeholder="0"
                                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold ml-1">Stock Level</label>
                                            <input
                                                required
                                                type="number"
                                                name="productQuantity"
                                                value={formData.productQuantity}
                                                onChange={handleChange}
                                                placeholder="0"
                                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" /> Attribute Matrix
                                    </h3>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {[
                                            { name: 'gender', label: 'Gender Segment', options: ['Men', 'Women', 'Unisex'] },
                                            { name: 'fragranceFamily', label: 'Scent Family', options: ['Floral', 'Woody', 'Fresh / Citrus', 'Oriental / Spicy', 'Gourmand'] },
                                            { name: 'occasion', label: 'Occasion', options: ['Everyday / Office', 'Date Night', 'Party / Night Out', 'Formal / Luxury', 'Sport / Fresh wear'] },
                                            { name: 'season', label: 'Season', options: ['Summer / Fresh', 'Winter / Warm & Spicy', 'All-season'] },
                                            { name: 'priceRange', label: 'Tier', options: ['Budget', 'Mid-range', 'Premium / Luxury'] },
                                            { name: 'longevity', label: 'Longevity', options: ['Light & Fresh', 'Moderate', 'Long-lasting / Strong'] }
                                        ].map(field => (
                                            <div key={field.name} className="space-y-2">
                                                <label className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold ml-1">{field.label}</label>
                                                <select 
                                                    name={field.name} 
                                                    value={formData[field.name]} 
                                                    onChange={handleChange}
                                                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-rose-500/30 transition-all font-sans appearance-none"
                                                >
                                                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Status Configuration
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {[
                                            { name: 'isNewArrival', label: 'New Arrival', icon: Sparkles, color: 'emerald' },
                                            { name: 'isBestSeller', label: 'Best Seller', icon: Zap, color: 'amber' },
                                            { name: 'isTrending', label: 'Hot Trend', icon: Flame, color: 'orange' }
                                        ].map(item => (
                                            <label 
                                                key={item.name}
                                                className={`flex flex-col items-center gap-3 p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                                                    formData[item.name] 
                                                        ? `bg-${item.color}-500/10 border-${item.color}-500/50 text-white shadow-[0_0_20px_rgba(16,185,129,0.05)]` 
                                                        : 'bg-zinc-900/30 border-zinc-800 text-zinc-600 hover:border-zinc-700'
                                                }`}
                                            >
                                                <input 
                                                    type="checkbox"
                                                    name={item.name}
                                                    checked={formData[item.name]}
                                                    onChange={handleChange}
                                                    className="hidden"
                                                />
                                                <item.icon size={18} className={formData[item.name] ? `text-${item.color}-500` : ''} />
                                                <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-center">{item.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-md flex items-center justify-end gap-4">
                        <button 
                            onClick={handleClose}
                            className="px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all"
                        >
                            Abort
                        </button>
                        <button 
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-12 py-4 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-amber-500 transition-all disabled:opacity-50 disabled:grayscale group"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>Publish Masterwork <Plus size={14} className="group-hover:rotate-90 transition-transform" /></>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddProductModal;
