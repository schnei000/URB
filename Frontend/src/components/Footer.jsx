export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">&copy; {currentYear} ProjectHub. Tous droits réservés.</p>
            </div>
        </footer>
    );
}