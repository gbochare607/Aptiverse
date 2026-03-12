import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CompetitionCard from '../components/CompetitionCard';
import { useAuth } from '@clerk/clerk-react';

export default function Competitions() {
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getToken } = useAuth();

    // Get API URL from env or default
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchCompetitions = async () => {
            try {
                const token = await getToken();
                const res = await axios.get(`${API_URL}/tests/competitions`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCompetitions(res.data);
            } catch (error) {
                console.error('Error fetching competitions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompetitions();
    }, [getToken, API_URL]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Competitions</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Join upcoming challenges and compete with others.</p>
                </div>
            </div>

            {competitions.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/7486/7486777.png"
                        alt="No competitions"
                        className="w-24 h-24 mx-auto mb-4 opacity-50 grayscale"
                    />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">No active competitions</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Check back later for new challenges!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {competitions.map(comp => (
                        <CompetitionCard key={comp._id} competition={comp} />
                    ))}
                </div>
            )}
        </div>
    );
}
