import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface SignInModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const loginSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export const SignInModal = ({ open, onOpenChange }: SignInModalProps) => {
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const onSubmit = async (values: LoginFormValues) => {
        console.log(values)
    }
    return (
        <ResponsiveModal
            title="Welcome back"
            description="Login to continue"
            open={open}
            onOpenChange={onOpenChange}
        >
            <div className="flex flex-col gap-6">
                <Card>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                                                    <FormLabel>
                                                        Password
                                                    </FormLabel>
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
                                            className="w-full"
                                            disabled={isPending}
                                        >
                                            Login
                                        </Button>
                                    </div>
                                    <div className="text-center text-sm">
                                        Don&apos;t have an account?{" "}
                                        <Link
                                            href="/signup"
                                            className="underline underline-offset-4"
                                        >
                                            Sign up
                                        </Link>
                                    </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </ResponsiveModal>
    );
};
