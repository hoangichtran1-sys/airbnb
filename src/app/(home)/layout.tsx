import { Navbar } from "@/features/home/ui/components/navbar";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <>
            <Navbar />
            <div className="pb-20 pt-28">{children}</div>
        </>
    );
};

export default Layout;
