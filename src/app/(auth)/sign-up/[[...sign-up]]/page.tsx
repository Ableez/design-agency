import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-white dark:bg-black">
      <SignUp />
    </div>
  );
}
