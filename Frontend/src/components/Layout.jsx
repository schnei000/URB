import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
            <Navbar />
            <main className="flex-grow">
                {/* 'children' sera le contenu de votre page */}
                {children}
            </main>
            <Footer />
        </div>
    );
}