import { Navbar } from "@/features/home/ui/components/navbar";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
};

export default Layout;
