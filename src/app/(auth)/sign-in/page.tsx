import { Asterisk, GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "#/components/auth/login-form";
import Image from "next/image";
import { IconAsterisk } from "@tabler/icons-react";
import Link from "next/link";
import { Spotlight } from "#/components/home/spotlight-bg";

export default function LoginPage() {
  return (
    <div className="relative grid min-h-svh w-[100vw] overflow-x-clip lg:grid-cols-2">
      <Spotlight />

      <div className="flex flex-col gap-4 px-4 py-6 md:p-10 md:py-0">
        <div className="flex justify-center gap-2 pt-8 md:justify-start">
          <Link
            href="/"
            className="mx-auto flex items-center gap-2 font-semibold"
          >
            <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md text-[#008aff]">
              <IconAsterisk width={40} strokeWidth={4} color="#008aff" />
            </div>
            Asterisk
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
