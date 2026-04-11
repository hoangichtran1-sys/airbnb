import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormControl,
    FormItem,
    FormMessage,
    FormLabel,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useLoginModal } from "../../hooks/use-login-modal";
import { useRegisterModal } from "../../hooks/use-register-modal";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SignInModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export const SignInModal = ({ open, onOpenChange }: SignInModalProps) => {
    const router = useRouter();

    const { onCloseLoginModal } = useLoginModal();
    const { onOpenRegisterModal } = useRegisterModal();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        await authClient.signIn.email(
            {
                email: values.email,
                password: values.password,
                callbackURL: "/",
            },
            {
                onSuccess: () => {
                    toast.success("Login successfully");
                    onCloseLoginModal();
                    router.push("/");
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
            },
        );
    };

    const onSocial = (provider: "google" | "facebook") => {
        authClient.signIn.social(
            {
                provider: provider,
                callbackURL: "/",
            },
            {
                onSuccess: () => {
                    toast.success(`Login with ${provider} successfully`);
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
            },
        );
    };

    const isPending = form.formState.isSubmitting;

    return (
        <ResponsiveModal
            title="Welcome back"
            description="Login to continue"
            open={open}
            onOpenChange={onOpenChange}
        >
            <div className="flex flex-col gap-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-6">
                            <div className="grid gap-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="e.g. test@gmail.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="*********"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    variant="tertiary"
                                    className="w-full"
                                    disabled={isPending}
                                >
                                    Login
                                </Button>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-4">
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => onSocial("google")}
                                >
                                    <FcGoogle />
                                    Continue with Google
                                </Button>
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => onSocial("facebook")}
                                >
                                    <FaFacebookF className="text-blue-500" />
                                    Continue with Facebook
                                </Button>
                            </div>
                        </div>
                        <div className="text-center text-sm text-muted-foreground mt-4">
                            Don&apos;t have an account?{" "}
                            <span
                                onClick={() => {
                                    onCloseLoginModal();
                                    onOpenRegisterModal();
                                }}
                                className="underline underline-offset-4 cursor-pointer"
                            >
                                Sign up
                            </span>
                        </div>
                    </form>
                </Form>
            </div>
        </ResponsiveModal>
    );
};
