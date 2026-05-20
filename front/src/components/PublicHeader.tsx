import { useNavigate } from "react-router-dom";
import { HiCog } from "react-icons/hi2";

export function PublicHeader() {
    const navigate = useNavigate();
    return (
        <header className="
            bg-white 
            border-b-4  
            border-brand-600  
            shadow-sm  
            px-8  
            flex  
            items-center  
            justify-between  
            h-[72px]
        ">
            <img
                onClick={() => navigate('/')}
                src="/logo-conorsa-azul.png"
                alt="Conorsa"
                className="h-12 object-contain cursor-pointer"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />

            <div className="flex items-center gap-2">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-1.5 text-slate-600 font-semibold text-sm px-3 py-2 rounded-lg transition-colors hover:bg-slate-100"
                >
                    Inicio
                </button>
                <span className="text-slate-400 text-xs font-semibold tracking-widest uppercase">
                    <button
                        onClick={() => navigate('/admin/welcome')}
                        className="group bg-white border-2 border-slate-200 rounded-xl cursor-pointer shadow-sm transition-all duration-200 hover:border-brand-600 hover:shadow-xl hover:-translate-y-1"
                    >
                        <HiCog className="w-5 h-5" />
                    </button>
                </span>
            </div>

        </header>
    );
}