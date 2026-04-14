import Image from "next/image";
import { AvatarImage, Avatar } from "./ui/avatar";
import { GeneratedAvatar } from "./generated-avatar";
import { User } from "@/lib/auth";

interface AvatarUserProps {
    user: User | null;
}

export const AvatarUser = ({ user }: AvatarUserProps) => {
    
    if (!user) {
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
            {user.image ? (
                <Avatar>
                    <AvatarImage src={user.image} />
                </Avatar>
            ) : (
                <GeneratedAvatar seed={user.name || user.email} />
            )}
        </>
    );
};
