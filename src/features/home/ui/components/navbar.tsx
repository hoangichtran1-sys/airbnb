import { Container } from "@/components/container";
import { Logo } from "./logo";
import { Search } from "./search";
import { UserMenu } from "./user-menu";
import { getCurrentUser } from "@/lib/auth-utils";
import { CategoryList } from "@/features/categories/ui/components/category-list";
import { RentModal } from "@/features/listing/ui/components/rent-modal";
import { SearchModal } from "@/features/search/ui/components/search-modal";
import { NotificationMenu } from "@/features/notifications/ui/components/notification-menu";

export const Navbar = async () => {
    const currentUser = await getCurrentUser();

    return (
        <>
            <RentModal />
            <SearchModal />
            <div className="fixed w-full bg-white z-10 shadow-sm">
                <div className="p-4 border-b">
                    <Container>
                        <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
                            <Logo />
                            <Search />
                            <div className="flex flex-row gap-3">
                                {currentUser && <NotificationMenu />}
                                 <UserMenu currentUser={currentUser} /> 
                            </div>
                        </div>
                    </Container>
                </div>
                <CategoryList />
            </div>
        </>
    );
};
