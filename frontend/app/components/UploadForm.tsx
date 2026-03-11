'use client';

import { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import StatusMessage from './StatusMessage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const ACCEPTED_TYPES = ['.csv', '.xlsx', '.xls'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

type Step = 1 | 2 | 3;

export default function UploadForm() {
    const [file, setFile] = useState<File | null>(null);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [activeStep, setActiveStep] = useState<Step>(1);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

    const isValidFile = (f: File) => {
        const ext = '.' + f.name.split('.').pop()?.toLowerCase();
        return ACCEPTED_TYPES.includes(ext) && f.size <= MAX_SIZE;
    };

    const handleFileSelect = (f: File) => {
        if (!isValidFile(f)) {
            setStatus('error');
            setMessage('Invalid file. Please upload a CSV or XLSX file under 10MB.');
            return;
        }
        setFile(f);
        setStatus('idle');
        setMessage('');
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files?.[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => setDragOver(false), []);

    const removeFile = () => {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const canSubmit = file && isValidEmail(email) && status !== 'loading';

    const handleSubmit = async () => {
        if (!canSubmit) return;

        setStatus('loading');
        setActiveStep(2);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('email', email.trim());

        try {
            const res = await axios.post(`${API_URL}/api/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 120000, // 2 min timeout for large files
            });
            setStatus('success');
            setMessage(res.data.message || 'Summary generated and sent to email successfully');
            setActiveStep(3);
        } catch (err: unknown) {
            setStatus('error');
            if (axios.isAxiosError(err) && err.response?.data?.error) {
                setMessage(err.response.data.error);
            } else {
                setMessage('Something went wrong. Please try again.');
            }
            setActiveStep(1);
        }
    };

    const steps: { num: Step; label: string }[] = [
        { num: 1, label: 'Upload File' },
        { num: 2, label: 'Generate Summary' },
        { num: 3, label: 'Email Sent' },
    ];

    return (
        <div className="w-full max-w-xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Step Indicator */}
                <div className="flex border-b border-gray-100">
                    {steps.map((s) => (
                        <button
                            key={s.num}
                            className={`flex-1 py-3.5 text-sm font-medium transition-colors relative ${activeStep >= s.num
                                    ? 'text-blue-600'
                                    : 'text-gray-400'
                                }`}
                            disabled
                        >
                            {s.num}. {s.label}
                            {activeStep === s.num && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-8">
                    {/* Source Data Label */}
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Source Data
                    </label>

                    {/* Drop Zone */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${dragOver
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                            }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                            className="hidden"
                        />
                        {/* Upload Icon */}
                        <div className="flex justify-center mb-3">
                            <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 mt-1">CSV or XLSX (max. 10MB)</p>
                    </div>

                    {/* File Chip */}
                    {file && (
                        <div className="mt-4 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-700 font-medium truncate max-w-xs">
                                    {file.name}
                                </span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile();
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Email Input */}
                    <div className="mt-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Recipient Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="executive@company.com"
                            className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className={`mt-6 w-full py-3 rounded-lg text-sm font-semibold transition-all ${canSubmit
                                ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow'
                                : 'bg-blue-300 text-white cursor-not-allowed'
                            }`}
                    >
                        Generate AI Summary
                    </button>

                    {/* Status Messages */}
                    <StatusMessage status={status} message={message} />
                </div>
            </div>
        </div>
    );
}
