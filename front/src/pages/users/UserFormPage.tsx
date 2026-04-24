import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/MainLayout';
import { getUser, createUser, updateUser, type CreateUserDto } from '../../api/usersApi';
import { HiArrowLeft } from 'react-icons/hi2';

const AVAILABLE_ROLES = ['admin', 'tecnico', 'user', 'super-user'];

export function UserFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<CreateUserDto & { isActive: boolean }>({
    name: '',
    email: '',
    password: '',
    roles: ['user'],
    isActive: true,
  });

  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      fetchUser(id);
    }
  }, [id, isEdit]);

  const fetchUser = async (userId: string) => {
    try {
      const { data } = await getUser(userId);
      setFormData({
        name: data.name,
        email: data.email,
        password: '', // Password hash is not returned
        roles: data.roles,
        isActive: data.isActive,
      });
    } catch (err) {
      setError('Error al cargar los datos del usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (isEdit && id) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await updateUser(id, updateData);
      } else {
        const { isActive, ...createData } = formData;
        await createUser(createData);
      }
      navigate('/admin/users');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el usuario');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout title={isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}>
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{isEdit ? 'Editar Usuario' : 'Crear Usuario'}</h1>
            <p className="text-slate-500 text-sm">Completa los datos del usuario.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-6 shadow-sm">
          <div className="grid gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Nombre Completo</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-slate-900 transition-all outline-none placeholder-slate-400"
                placeholder="Ej. Juan Pérez"
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
                placeholder="juan@ejemplo.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">
                Contraseña {isEdit && <span className="text-xs text-slate-400">(dejar vacío para mantener)</span>}
              </label>
              <input
                type="password"
                required={!isEdit}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-slate-900 transition-all outline-none placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>

            {/* Roles */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-3 ml-1">Roles asignados</label>
              <div className="flex flex-wrap gap-3">
                {AVAILABLE_ROLES.map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleToggle(role)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${formData.roles.includes(role)
                      ? 'bg-brand-50 border-brand-200 text-brand-700'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Estado */}
            {isEdit && (
              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">Usuario Activo</div>
                  <div className="text-xs text-slate-500">Determina si el usuario puede iniciar sesión.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-md transition-colors focus:outline-none ${formData.isActive ? 'bg-brand-600' : 'bg-slate-300'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-sm bg-white transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-xl transition-colors text-sm border border-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-[2] bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition-colors text-sm shadow-lg shadow-brand-500/20"
            >
              {isSaving ? 'Guardando...' : (isEdit ? 'Guardar Cambios' : 'Crear Usuario')}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
