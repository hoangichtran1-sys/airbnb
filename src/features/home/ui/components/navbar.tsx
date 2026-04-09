import { Container } from "@/components/container";
import { Logo } from "./logo";
import { Search } from "./search";
import { UserMenu } from "./user-menu";
import { getCurrentUser } from "@/lib/auth-utils";

export const Navbar = async () => {
    const currentUser = await getCurrentUser();

    return (
        <div className="fixed w-full bg-white z-10 shadow-sm">
            <div className="p-4 border-b">
                <Container>
                    <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
                        <Logo />
                        <Search />
                        <UserMenu currentUser={currentUser}/>
                    </div>
                </Container>
            </div>
        </div>
    );
};
