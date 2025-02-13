"use client";
import DesignInfoForm from "#/components/design-info/design-info-form";
import { SocialFormState } from "#/components/social-media-designs/data";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader } from "#/components/ui/card";
import type { DesignJobData } from "#/types/jobs";
import { IconInfoCircleFilled, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { use } from "react";

interface Props {
  params: Promise<{ jobId: string }>;
}

const DesignInfo = ({ params }: Props) => {
  const { jobId } = use(params);
  const jobsCookie = sessionStorage.getItem(jobId);
  const jobFormState = JSON.parse(jobsCookie ?? "{}") as DesignJobData;

  if (!jobsCookie) {
    return <ErrorMessage />;
  }

  try {
    const jobInfo = jobFormState as DesignJobData;

    return (
      <div className="container mx-auto max-w-2xl bg-white dark:bg-black">
        <header className="sticky top-0 mb-4 flex items-center justify-between bg-black/60 px-4 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <Link
              href={`/${jobInfo.service.toLocaleLowerCase().replaceAll(" ", "-")}`}
            >
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                aria-label="Close"
              >
                <IconX className="h-6 w-6 text-blue-500" strokeWidth={3} />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Your order</h1>
          </div>

          <Button variant="ghost" className="flex items-center gap-2">
            <IconInfoCircleFilled className="h-6 w-6 text-blue-500" />
            <span>Help</span>
          </Button>
        </header>

        <h2 className="mb-6 max-w-xs pl-6 text-3xl font-bold">
          Just one more step
        </h2>

        {/* Summary Card */}
        <Card className="mx-4 mb-8">
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-500">Summary</h2>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2 rounded-lg bg-neutral-900 p-4">
              <div className="font-medium">{jobInfo.service}</div>
              <div className="text-sm lowercase text-neutral-400 first-letter:capitalize">
                {jobInfo.purpose} for {jobInfo.size}
              </div>
              <div className="text-sm text-neutral-400">
                Platform: {jobInfo.platform}
              </div>
              <div className="text-sm text-neutral-400">
                Delivery: {jobInfo.deliveryOption}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Design Preferences Section */}
        <section className="mb-8 px-4">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <p className="text-sm text-neutral-400">
                  Describe your design preferences in detail. The more
                  information you provide, the better we can tailor the design
                  to your needs.
                </p>
              </div>
              <DesignInfoForm jobInfo={jobInfo} jobId={jobId} />
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="p-4 pb-10 text-center">
          <p className="text-sm text-neutral-400">
            You can always talk to us if you have any questions or changes in
            mind.{" "}
            <Link
              href="terms"
              className="text-blue-500 underline-offset-2 hover:underline"
            >
              Terms and conditions
            </Link>{" "}
            apply
          </p>
        </footer>
      </div>
    );
  } catch (error) {
    console.error("Error parsing jobs cookie:", error);
    return <ErrorMessage />;
  }
};

const ErrorMessage = () => (
  <div className="mx-auto mt-14 max-w-[90dvw] rounded-2xl p-8 text-xl dark:bg-neutral-800">
    Seems like we cant find what you are looking for
  </div>
);

export default DesignInfo;
