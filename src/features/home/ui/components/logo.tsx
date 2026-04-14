import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
    return (
        <Link href="/">
            <Image
                src="/logo.png"
                alt="Logo"
                className="hidden md:block cursor-pointer"
                width={100}
                height={100}
                loading="eager"
            />
        </Link>
    );
};
