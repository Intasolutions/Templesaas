import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';

const TVDisplay = () => {
    const [servingNow, setServingNow] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axios.get('/api/queues/tv-display/');
                // Backend returns { tv_display: [...] }
                setServingNow(response.data.tv_display || []);
            } catch (err) {
                console.error("TV Display fetch failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="p-10 text-white text-center">Loading Display...</div>;

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center">
            <h1 className="text-5xl font-bold mb-12 text-blue-400">NOW SERVING</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                {servingNow.map((session, index) => (
                    <div key={index} className="bg-slate-800 border-2 border-blue-500 rounded-3xl p-8 text-center shadow-2xl">
                        <h2 className="text-3xl font-semibold mb-6">{session.session_name}</h2>
                        <div className="text-8xl font-bold text-yellow-400">
                            #{session.now_serving || '---'}
                        </div>
                        <div className="mt-4 text-slate-400 text-xl">
                            Please proceed to Counter
                        </div>
                    </div>
                ))}
            </div>

            {servingNow.length === 0 && (
                <div className="text-3xl text-slate-500 mt-20">
                    No active queue sessions
                </div>
            )}
        </div>
    );
};

export default TVDisplay;
