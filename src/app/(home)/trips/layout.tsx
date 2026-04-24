import { requireAuth } from "@/lib/auth-utils";
import { StripeEventProvider } from "@/providers/stripe-event-provider";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
    const session = await requireAuth();

    return (
        <>
            <StripeEventProvider userId={session.user.id} />
            {children}
        </>
    );
};

export default Layout;