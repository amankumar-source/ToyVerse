import CustomCursor from './CustomCursor';
import Header from './Header';
import Cart from './Cart';

export default function Layout({ children }) {
    return (
        <main className="w-full min-h-screen relative overflow-x-hidden bg-toy-light selection:bg-toy-yellow selection:text-toy-dark">
            <CustomCursor />
            <Header />
            <Cart />
            <div className="relative z-10 w-full">
                {children}
            </div>
        </main>
    );
}
