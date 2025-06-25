import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStats, getAdminUsers, deleteAdminUser } from '../config/api';
import PageLayout from '../components/PageLayout';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, boards: 0, tasks: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [statsData, usersData] = await Promise.all([
                getAdminStats(),
                getAdminUsers()
            ]);

            setStats(statsData);
            setUsers(usersData);
        } catch (err) {
            if (err.message.includes('403')) {
                setError('Acceso denegado. Solo el administrador puede acceder a esta página.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (!confirm(`¿Estás seguro de que quieres eliminar al usuario "${username}"? Esta acción eliminará todos sus tableros y tareas de forma permanente.`)) {
            return;
        }

        try {
            setDeletingUser(userId);
            await deleteAdminUser(userId);
            
            await fetchData();
            alert('Usuario eliminado correctamente');
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setDeletingUser(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <PageLayout title="Dashboard Administrativo" showBackButton={true}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
                    <p className="mt-4 text-white/80">Cargando dashboard...</p>
                </div>
            </PageLayout>
        );
    }

    if (error) {
        return (
            <PageLayout title="Dashboard Administrativo" showBackButton={true}>
                <div className="text-center">
                    <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-3 rounded mb-4">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Volver al inicio
                    </button>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Dashboard Administrativo" showBackButton={true}>
            <div className="space-y-6">
                {/* Estadísticas */}
                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Estadísticas del Sistema</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-purple-300">{stats.users}</div>
                            <div className="text-white/80 text-sm">Usuarios</div>
                        </div>
                        <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-blue-300">{stats.boards}</div>
                            <div className="text-white/80 text-sm">Tableros</div>
                        </div>
                        <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-green-300">{stats.tasks}</div>
                            <div className="text-white/80 text-sm">Tareas</div>
                        </div>
                    </div>
                </div>

                {/* Lista de usuarios */}
                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Gestión de Usuarios</h2>
                    
                    {users.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-white/60">No hay usuarios registrados</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {users.map((user) => (
                                <div key={user.id} className="bg-white/10 border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-purple-600/30 rounded-full flex items-center justify-center border border-purple-400/30">
                                                <span className="text-lg font-semibold text-purple-300">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-semibold text-white">{user.username}</span>
                                                    {user.username === 'luca' && (
                                                        <span className="px-2 py-1 bg-yellow-600/30 text-yellow-300 text-xs rounded-full border border-yellow-400/30">
                                                            Admin
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-white/60">
                                                    Registrado: {formatDate(user.created_at)}
                                                </div>
                                                <div className="text-sm text-white/60">
                                                    {user.boards_count} tableros • {user.tasks_count} tareas
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            {user.username !== 'luca' ? (
                                                <button
                                                    onClick={() => handleDeleteUser(user.id, user.username)}
                                                    disabled={deletingUser === user.id}
                                                    className="bg-red-600/20 hover:bg-red-600/30 text-red-300 px-3 py-1 rounded border border-red-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    {deletingUser === user.id ? 'Eliminando...' : 'Eliminar'}
                                                </button>
                                            ) : (
                                                <span className="text-white/40 text-sm">No disponible</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default AdminDashboard; 