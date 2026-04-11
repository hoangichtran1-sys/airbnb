import { Container } from "@/components/container";
import { Logo } from "./logo";
import { Search } from "./search";
import { UserMenu } from "./user-menu";
import { getCurrentUser } from "@/lib/auth-utils";
import { CategoryList } from "@/features/categories/ui/components/category-list";
import { RentModal } from "@/features/listing/ui/components/rent-modal";

export const Navbar = async () => {
    const currentUser = await getCurrentUser();

    return (
        <>
            <RentModal />
            <div className="fixed w-full bg-white z-10 shadow-sm">
                <div className="p-4 border-b">
                    <Container>
                        <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
                            <Logo />
                            <Search />
                            <UserMenu currentUser={currentUser} />
                        </div>
                    </Container>
                </div>
                <CategoryList />
            </div>
        </>
    );
};
