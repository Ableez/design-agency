"use client";

import { UploadButton, UploadDropzone } from "#/lib/uploadthing";
import { useCallback, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { UploadedImagesCarousel } from "./uploaded-images-carousel";
import { toast } from "sonner";
import { ClientUploadedFileData } from "uploadthing/types";
import { DesignJobData } from "#/types/jobs";
import BrandCreatorDrawer from "../auth/brand-creator-drawer";
import { useUser } from "@clerk/nextjs";
import { api } from "#/trpc/react";
import { BrandSelect } from "#/server/db/schema-types";
import { v4 } from "uuid";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { Input } from "../ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IconLoader2 } from "@tabler/icons-react";

type ImageStatus = "uploading" | "uploaded" | "failed";

type ImageData = {
  url: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  status: ImageStatus;
  clientId: string;
};

const DesignInfoForm: React.FC<{
  jobId: string;
  jobInfo: DesignJobData;
}> = ({ jobId, jobInfo }) => {
  const localStorageDescriptionKey = `designInfoDescription-${jobId}`;
  const localStorageImagesKey = `designInfoImages-${jobId}`;
  const [openBrandCreator, setOpenBrandCreator] = useState(false);
  const { user, isSignedIn } = useUser();
  const { data: userBrandData } = api.brand.getUserBrandByUserId.useQuery({
    userId: user?.id,
  });
  const createJob = api.designJobs.create.useMutation();
  const [brandData, setBrandData] = useState<BrandSelect | null>(
    userBrandData ?? null,
  );
  const [deliveryEmail, setDeliveryEmail] = useState<string | null>(
    user?.emailAddresses[0]?.emailAddress ?? null,
  );
  const [openEmailDrawer, setOpenEmailDrawer] = useState(false);
  const router = useRouter();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  useEffect(() => {
    if (userBrandData) {
      setBrandData(userBrandData);
    }
  }, [userBrandData]);

  const [description, setDescription] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(localStorageDescriptionKey) ?? "";
    }
    return "";
  });

  const [images, setImages] = useState<ImageData[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const storedImages = localStorage.getItem(localStorageImagesKey);
        return storedImages
          ? (JSON.parse(storedImages) as ImageData[]).map((img) => ({
              ...img,
              status: img.status === "uploading" ? "failed" : img.status,
              previewUrl: undefined,
            }))
          : [];
      } catch (error) {
        console.error("Error parsing stored images:", error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(localStorageDescriptionKey, description);
  }, [description, jobId, localStorageDescriptionKey]);

  useEffect(() => {
    localStorage.setItem(localStorageImagesKey, JSON.stringify(images));
  }, [images, jobId, localStorageImagesKey]);

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDescription(e.target.value);
    },
    [],
  );

  const handleRemoveImage = useCallback((clientId: string) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.clientId === clientId);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((img) => img.clientId !== clientId);
    });
  }, []);

  console.log("IMAGES", images);
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
      });
    };
  }, [images]);

  const handleBeforeUploadBegin = useCallback((files: File[]) => {
    const newImages = files.map((file) => {
      const clientId = v4();

      return {
        clientId,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl: URL.createObjectURL(file),
        url: "",
        status: "uploading" as const,
      };
    });

    setImages((prev) => [...prev, ...newImages]);

    // Add clientId to file metadata
    return files.map((file, index) => {
      return new File([file], file.name, {
        type: file.type,
        // @ts-ignore - Custom metadata
        customId: newImages[index].clientId,
      });
    });
  }, []);
  const handleUploadComplete = useCallback(
    (res: ClientUploadedFileData<{ customId: string }>[]) => {
      const updates = res.map((file) => ({
        // Properly access the customId from metadata
        name: file.name,
        url: file.url,
      }));

      console.log("UPLOAD COMPLETE", res);

      console.log("UPDATES", updates);

      setImages((prev) =>
        prev.map((img) => {
          const update = updates.find((u) => u.name === img.name);

          console.log("UPDATE", update);
          if (!update) {
            // Mark as failed if not found in response
            if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
            return { ...img, previewUrl: undefined };
          }

          if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
          return {
            ...img,
            url: update.url,
            previewUrl: undefined,
            status: "uploaded",
          };
        }),
      );
      toast.success("Upload complete");
    },
    [],
  );

  const handleUploadError = useCallback((error: Error) => {
    toast.error("Upload failed");
    console.log("ERROR", error);
    setImages((prev) =>
      prev.map((img) => {
        if (img.status === "uploading") {
          if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
          return { ...img, status: "failed", previewUrl: undefined };
        }
        return img;
      }),
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsSubmitLoading(true);

    try {
      const formData = {
        job: {
          id: jobId,
          info: jobInfo,
        },
        description: {
          content: description,
          length: description.length,
        },
        media: {
          images: images.map((img) => ({
            name: img.name,
            type: img.type,
            size: `${(img.size / 1024).toFixed(2)}KB`,
            url: img.url,
            status: img.previewUrl ? "uploading" : "uploaded",
          })),
          totalImages: images.length,
          remainingUploads: 5 - images.length,
        },
        user: {
          isSignedIn: isSignedIn,
          brandExists: !!brandData,
          userId: user?.id,
        },
      };

      console.log("USER BRAND DATA  ", brandData);

      if (!isSignedIn && !brandData) {
        toast("Just one last thing, I promise.");
        setOpenBrandCreator(true);
        return;
      }

      console.log("DATA TO DB", {
        brandId: brandData!.id!,
        designDescription: formData.description.content,
        jobId: formData.job.id,
        platform: "",
        referenceImages: formData.media.images.map((img) => ({
          name: img.name,
          type: img.type,
          size: img.size,
          url: img.url,
        })),
        service: formData.job.info.service,
        userId: user?.id,
        designDeliveryOptionId:
          formData.job.info.designDeliveryOption?.id ?? null,
        purpose: formData.job.info.purpose ?? null,
        sizeId: formData.job.info.size?.id ?? null,
      });

      console.log("JOBS", formData.job);

      if (!deliveryEmail) {
        toast("We kinda need your email address to deliver your designs. 😅");
        setOpenEmailDrawer(true);
        return;
      }

      await createJob.mutateAsync({
        brandId: brandData!.id!,
        designDescription: formData.description.content,
        jobId: formData.job.id,
        platform: formData.job.info.platform,
        referenceImages: formData.media.images.map((img) => ({
          name: img.name,
          type: img.type,
          size: img.size,
          url: img.url,
        })),
        service: formData.job.info.service,
        userId: user?.id ?? null,
        designDeliveryOptionId: formData.job.info.size?.id ?? null,
        purpose: formData.job.info.purpose ?? null,
        sizeId: formData.job.info.size?.id ?? null,
        deliveryDate: new Date().toISOString(),
        deliveryEmail: deliveryEmail! ?? user?.emailAddresses[0]?.emailAddress,
        deliveryDurationInHours:
          formData.job.info.designDeliveryOption?.durationInHours ?? 0,
      });
      toast("We have received your job request 😎🥂!");

      if (!isSignedIn) {
        toast("Done! Now you gatta sign in 😎!");
        router.push("/sign-in");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("ERROR SUBMITTING JOB:", error);
      toast.error("👀Something went wrong!");
    } finally {
      setIsSubmitLoading(false);
    }
  }, [
    brandData,
    createJob,
    deliveryEmail,
    description,
    images,
    isSignedIn,
    jobId,
    jobInfo,
    router,
    user?.emailAddresses,
    user?.id,
  ]);

  return (
    <div className="flex flex-col gap-4">
      {brandData && (
        <div className="relative mb-8 p-8">
          <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 scale-x-[1.014] scale-y-[1.01] rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-orange-600 p-7 opacity-40 blur-sm" />
          <div className="absolute left-1/2 top-1/2 z-10 flex w-full -translate-x-1/2 -translate-y-1/2 place-items-center justify-start gap-2 rounded-2xl border p-2 px-4 align-middle text-white dark:border-neutral-600 dark:bg-neutral-950">
            <Image
              src={brandData.logo ?? "/favicon.png"}
              alt="Brand logo"
              width={30}
              height={30}
              className="opacity-60 grayscale"
            />
            <h4 className="text-lg font-semibold capitalize">
              {brandData.name}
            </h4>
          </div>
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()}>
        <h4 className="mb-1 pl-1 text-sm font-medium text-neutral-500">
          Add image: Optional
        </h4>
        <div>
          {images.length === 0 && (
            <UploadDropzone
              endpoint="imageUploader"
              onBeforeUploadBegin={handleBeforeUploadBegin}
              onClientUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              config={{ mode: "auto" }}
              disabled={isSubmitLoading}
            />
          )}
          {images.length > 0 && (
            <UploadedImagesCarousel
              handleRemoveImage={handleRemoveImage}
              images={images.map((img) => ({
                url: img.previewUrl ?? img.url,
                status: img.status,
                clientId: img.clientId,
              }))}
            />
          )}
          {images.length > 0 && images.length < 5 && (
            <UploadButton
              endpoint="imageUploader"
              onBeforeUploadBegin={handleBeforeUploadBegin}
              onClientUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              config={{ mode: "auto" }}
              disabled={isSubmitLoading}
            />
          )}
        </div>
        <h4 className="mb-1 pl-1 text-sm font-medium text-neutral-500">
          Description*
        </h4>

        <Textarea
          className="resize-none"
          placeholder="Type here..."
          value={description}
          onChange={(e) => handleDescriptionChange(e)}
          disabled={isSubmitLoading}
        />
        <Button
          className="mt-4 w-full"
          onClick={handleSubmit}
          disabled={isSubmitLoading}
        >
          {isSubmitLoading ? (
            <IconLoader2 width={16} className="animate-spin duration-300" />
          ) : (
            "Continue"
          )}
        </Button>
      </form>
      <BrandCreatorDrawer
        open={openBrandCreator}
        onOpenChange={(b) => setOpenBrandCreator(b)}
        onFinished={(data: BrandSelect & { error: string | null }) =>
          setBrandData(data)
        }
        handleDeliveryEmailChange={(text) => setDeliveryEmail(text)}
        deliveryEmail={deliveryEmail}
      />
      <Drawer open={openEmailDrawer} onOpenChange={setOpenEmailDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Your email</DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-col gap-4 p-4 pb-16">
            <Input
              value={deliveryEmail ?? ""}
              onChange={(e) => setDeliveryEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full"
            />
            <Button className="w-full">Continue</Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default DesignInfoForm;
