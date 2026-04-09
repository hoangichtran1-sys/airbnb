import Image from "next/image";
import { AvatarImage, Avatar } from "./ui/avatar";
import { GeneratedAvatar } from "./generated-avatar";
import { User } from "@/lib/auth";

interface AvatarUserProps {
    currentUser: User | null;
}

export const AvatarUser = ({ currentUser }: AvatarUserProps) => {
    
    if (!currentUser) {
        return (
            <Image
                className="rounded-full"
                height={32}
                width={32}
                alt="Avatar"
                src="/placeholder.jpg"
                loading="eager"
            />
        );
    }

    return (
        <>
            {currentUser.image ? (
                <Avatar>
                    <AvatarImage src={currentUser.image} />
                </Avatar>
            ) : (
                <GeneratedAvatar seed={currentUser.name || currentUser.email} />
            )}
        </>
    );
};
