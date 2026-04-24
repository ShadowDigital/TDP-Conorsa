import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../components/MainLayout';
import { getProfile, updateProfile } from '../api/usersApi';

export function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user?.id]);

  const fetchProfile = async (id: string) => {
    try {
      const { data } = await getProfile(id);
      setFormData({
        name: data.name,
        email: data.email,
        password: '',
      });
    } catch (err) {
      setError('Error al cargar la información del perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }

      await updateProfile(user.id, updateData);
      setSuccess('Perfil actualizado correctamente');
      setFormData(prev => ({ ...prev, password: '' }));
      
      // Note: If the user changes their email, the AuthContext might still have the old one 
      // until the next login or if we call a refresh method. 
      // For now, we'll just indicate success.
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout title="Mi Perfil">
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Mi Perfil">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>
          <p className="text-slate-500 text-sm">Gestiona tu información personal y contraseña.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-xl text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-6 shadow-sm">
          <div className="grid gap-6">
            {/* ID (Read Only) */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">ID de Usuario</label>
              <input
                type="text"
                readOnly
                value={user?.id || ''}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-slate-400 cursor-not-allowed outline-none font-mono text-sm"
              />
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Nombre Completo</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-slate-900 transition-all outline-none placeholder-slate-400"
                placeholder="Tu nombre completo"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-slate-900 transition-all outline-none placeholder-slate-400"
                placeholder="tu@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">
                Nueva Contraseña <span className="text-xs text-slate-400">(dejar vacío para mantener actual)</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-slate-900 transition-all outline-none placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition-colors text-sm shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Guardando cambios...
                </>
              ) : (
                'Guardar Perfil'
              )}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
