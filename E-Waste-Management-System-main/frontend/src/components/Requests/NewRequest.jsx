import React, { useState } from 'react';
import {
    Laptop,
    Smartphone,
    Tv,
    Watch,
    Speaker,
    Camera,
    Upload,
    MapPin,
    CheckCircle2,
    ChevronRight,
    ArrowLeft,
    Info,
    Package
} from 'lucide-react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const deviceTypes = [
    { id: 'LAPTOP', label: 'Laptop', icon: Laptop },
    { id: 'SMARTPHONE', label: 'Smartphone', icon: Smartphone },
    { id: 'TELEVISION', label: 'Television', icon: Tv },
    { id: 'WEARABLE', label: 'Wearable', icon: Watch },
    { id: 'AUDIO', label: 'Audio Device', icon: Speaker },
    { id: 'CAMERA', label: 'Camera', icon: Camera },
    { id: 'OTHER', label: 'Other E-Waste', icon: Package },
];

const NewRequest = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        deviceType: '',
        brand: '',
        model: '',
        quantity: '1',
        condition: 'WORKING',
        pickupAddress: '',
        remarks: ''
    });
    const [files, setFiles] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        files.forEach(file => data.append('images', file));

        try {
            await api.post('/api/requests', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto py-20 px-6 text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Request Submitted!</h1>
                <p className="text-gray-600 text-lg mb-10">
                    Our team will review your request and schedule a pickup soon. You can track the progress in your dashboard.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg"
                    >
                        Go to Dashboard
                    </button>
                    <button
                        onClick={() => { setSubmitted(false); setStep(1); setFormData({ ...formData, deviceType: '' }); }}
                        className="px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                    >
                        Submit Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Schedule a Pickup</h1>
                    <p className="text-gray-500">Provide details about the e-waste you'd like to recycle.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                    <Info className="w-4 h-4" />
                    Earn points for every recycle
                </div>
            </div>

            {/* Progress Stepper */}
            <div className="flex items-center gap-4 mb-8">
                {[1, 2, 3].map((s) => (
                    <React.Fragment key={s}>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${step >= s ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200Scale-110' : 'bg-gray-200 text-gray-500'
                            }`}>
                            {s}
                        </div>
                        {s < 3 && <div className={`flex-1 h-1 rounded-full transition-all ${step > s ? 'bg-emerald-600' : 'bg-gray-200'}`} />}
                    </React.Fragment>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-8">
                    {/* Step 1: Device Selection */}
                    {step === 1 && (
                        <div className="space-y-8 animate-in slide-in-from-right duration-500">
                            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-4">What item are you recycling?</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {deviceTypes.map((device) => (
                                    <button
                                        key={device.id}
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, deviceType: device.id });
                                            setStep(2);
                                        }}
                                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all group ${formData.deviceType === device.id
                                                ? 'border-emerald-500 bg-emerald-50 shadow-md transform scale-105'
                                                : 'border-gray-100 bg-gray-50 hover:border-emerald-200 hover:bg-white hover:shadow-lg'
                                            }`}
                                    >
                                        <div className={`p-4 rounded-full transition-colors ${formData.deviceType === device.id ? 'bg-emerald-600 text-white' : 'bg-white text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500'
                                            }`}>
                                            <device.icon className="w-8 h-8" />
                                        </div>
                                        <span className={`mt-4 font-bold text-sm ${formData.deviceType === device.id ? 'text-emerald-700' : 'text-gray-600'
                                            }`}>
                                            {device.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Item Details */}
                    {step === 2 && (
                        <div className="space-y-8 animate-in slide-in-from-right duration-500">
                            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-4">Item Specifications</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Brand</label>
                                    <input
                                        name="brand"
                                        required
                                        value={formData.brand}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        placeholder="e.g. Apple, Samsung, Dell"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Model Name/No.</label>
                                    <input
                                        name="model"
                                        required
                                        value={formData.model}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        placeholder="e.g. MacBook Pro, Galaxy S21"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Quantity</label>
                                    <select
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
                                    >
                                        {[1, 2, 3, 4, 5, 10].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Functional Condition</label>
                                    <select
                                        name="condition"
                                        value={formData.condition}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
                                    >
                                        <option value="WORKING">Fully Functional</option>
                                        <option value="DEFECTIVE">Partially Working / Minor Defects</option>
                                        <option value="NON_FUNCTIONAL">Completely Dead / Scrap</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-between pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3 text-gray-500 font-bold hover:text-gray-900 transition-colors flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-5 h-5" /> Back
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    disabled={!formData.brand || !formData.model}
                                    className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
                                >
                                    Next Step <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Photos & Logistics */}
                    {step === 3 && (
                        <div className="space-y-8 animate-in slide-in-from-right duration-500">
                            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-4">Pickup Logistics</h2>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Pickup Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-4 text-emerald-500 w-5 h-5" />
                                        <textarea
                                            name="pickupAddress"
                                            required
                                            value={formData.pickupAddress}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                            placeholder="Enter the full address where the item is located"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Remarks (Optional)</label>
                                    <textarea
                                        name="remarks"
                                        value={formData.remarks}
                                        onChange={handleChange}
                                        rows="2"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        placeholder="Any special instructions for the pickup person?"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Upload Photos (Optional)</label>
                                    <div className="relative group cursor-pointer">
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="p-10 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 flex flex-col items-center justify-center transition-all group-hover:border-emerald-400 group-hover:bg-emerald-50/30">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                                <Upload className="w-8 h-8 text-emerald-600" />
                                            </div>
                                            <p className="font-bold text-gray-700">
                                                {files.length > 0 ? `${files.length} files selected` : 'Drag and drop or click to upload'}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2">Max 50MB per file. JPG, PNG supported.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="px-6 py-3 text-gray-500 font-bold hover:text-gray-900 transition-colors flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-5 h-5" /> Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !formData.pickupAddress}
                                    className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>Submit Request <CheckCircle2 className="w-5 h-5" /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </form>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
                <div className="bg-white p-2 rounded-lg shrink-0 shadow-sm self-start">
                    <Info className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                    <h4 className="font-bold text-blue-900 mb-1">Environmental Impact</h4>
                    <p className="text-sm text-blue-700 leading-relaxed">
                        By recycling this item, you are preventing hazardous chemicals like lead, mercury, and cadmium from polluting the soil and groundwater. Thank you for making a difference!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NewRequest;
