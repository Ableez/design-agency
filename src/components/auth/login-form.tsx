"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "#/lib/utils";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#/components/ui/form";
import { useEffect, useTransition } from "react";
import { login } from "#/server/actions/auth";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "#/lib/auth-client";
import { type Providers } from "#/lib/auth";

const formSchema = z.object({
  emailOrPhone: z.string().min(2, {
    message: "Email or Phone is required.",
  }),
});

type LoginFormProps = React.ComponentPropsWithoutRef<"form">;

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrPhone: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      await login(values.emailOrPhone);
    });
  }

  useEffect(() => {
    async function fn() {
      const conditionalMediationAvailable =
        await PublicKeyCredential.isConditionalMediationAvailable?.();
      if (!conditionalMediationAvailable) {
        return;
      }

      void authClient.signIn.passkey({ autoFill: true });
    }

    void fn();

    return () => void fn();
  }, []);

  async function handlePasskey() {
    const opts = await authClient.passkey.generateRegisterOptions({
      fetchOptions: {
        onError(context) {
          console.error("Error", context.error);
        },
      },
    });
    const data = await authClient.passkey.addPasskey();
    console.log(data);
  }

  async function handleProviderSignIn(provider: Providers) {
    const data = await authClient.signIn.social({
      provider: provider,
    });
    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col gap-2 text-center">
          <h1 className="mb-8 text-2xl font-bold">Login</h1>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="emailOrPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ml-2 dark:text-neutral-500">
                  Email or Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-10"
                    placeholder="m@example.com"
                    autoComplete="email webauthn"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant={"secondary"}
            className="h-10 w-full"
            disabled={isPending}
          >
            Get OTP
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-neutral-200 dark:after:border-neutral-700">
            <span className="relative z-10 bg-neutral-100 px-2 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
              Or continue with
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => handlePasskey()}
              type={"button"}
              className="relative h-[2.7rem] w-full"
            >
              <Image
                alt="G"
                src={"/passkey.svg"}
                width={18}
                height={18}
                className="absolute left-10 top-1/2 -translate-y-1/2"
              />
              Use passkey
            </Button>
            <Button
              type={"button"}
              onClick={() => handleProviderSignIn("google")}
              variant="secondary"
              className="relative h-[2.7rem] w-full"
            >
              <Image
                alt="G"
                src={"/google.svg"}
                width={18}
                height={18}
                className="absolute left-10 top-1/2 -translate-y-1/2"
              />
              Login with Google
            </Button>

            <Button
              type={"button"}
              variant="secondary"
              className="relative h-[2.7rem] w-full"
            >
              <Image
                alt="G"
                src={"/facebook.svg"}
                width={24}
                height={24}
                className="absolute left-10 top-1/2 -translate-y-1/2"
              />
              Login with Facebook
            </Button>
            <Button
              type={"button"}
              variant="secondary"
              className="relative h-[2.7rem] w-full"
            >
              <Image
                alt="G"
                src={"/instagram.svg"}
                width={18}
                height={18}
                className="absolute left-10 top-1/2 -translate-y-1/2"
              />
              Login with Instagram
            </Button>
            <Button
              onClick={async () => {
                await handleProviderSignIn("github");
              }}
              type={"button"}
              variant="secondary"
              className="relative h-[2.7rem] w-full"
            >
              <Image
                alt="G"
                src={"/github.svg"}
                width={18}
                height={18}
                className="absolute left-10 top-1/2 -translate-y-1/2"
              />
              Login with GitHub
            </Button>
          </div>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold underline underline-offset-4"
          >
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
}
