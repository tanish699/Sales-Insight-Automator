'use client';

interface StatusMessageProps {
    status: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
}

export default function StatusMessage({ status, message }: StatusMessageProps) {
    if (status === 'idle') return null;

    return (
        <div className="mt-6 space-y-3">
            {/* Loading State */}
            {status === 'loading' && (
                <div className="flex items-center gap-3 px-5 py-3.5 bg-blue-50 border border-blue-100 rounded-lg">
                    <svg
                        className="animate-spin h-5 w-5 text-blue-500 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                    <span className="text-sm text-blue-700 font-medium">
                        Analyzing your sales data...
                    </span>
                </div>
            )}

            {/* Success State */}
            {status === 'success' && (
                <div className="flex items-center gap-3 px-5 py-3.5 bg-green-50 border border-green-100 rounded-lg">
                    <svg className="h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-sm text-green-700 font-medium">
                        {message || 'Summary generated and sent to email successfully'}
                    </span>
                </div>
            )}

            {/* Error State */}
            {status === 'error' && (
                <div className="flex items-center gap-3 px-5 py-3.5 bg-red-50 border border-red-100 rounded-lg">
                    <svg className="h-5 w-5 text-red-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-sm text-red-700 font-medium">
                        {message || 'Something went wrong. Please try again.'}
                    </span>
                </div>
            )}
        </div>
    );
}
