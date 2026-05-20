
export function PublicFooter() {
    return (
        <footer className="bg-white border-t border-slate-200 py-4 px-8 text-center text-slate-400 text-xs">
            © {new Date().getFullYear()} Construcciones Normalizadas, S.A. — Todos los derechos reservados
        </footer>
    );
}