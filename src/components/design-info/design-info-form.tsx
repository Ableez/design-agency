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

  useEffect(() => {
    if (userBrandData) {
      setBrandData(userBrandData);
    }
  }, [userBrandData]);

  console.log("BRAND DATA", brandData);

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
        clientId: file.customId || file.name,
        url: file.url,
      }));

      setImages((prev) =>
        prev.map((img) => {
          const update = updates.find(
            (u) => u.clientId === (img.clientId ?? img.name),
          );
          if (!update) {
            // Mark as failed if not found in response
            if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
            return { ...img, status: "failed", previewUrl: undefined };
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
        brandExists: !!userBrandData,
        userId: user?.id,
      },
    };

    if (!isSignedIn) {
      toast("Just one last thing, I promise.");
      setOpenBrandCreator(true);
      return;
    }

    if (!userBrandData) {
      setOpenBrandCreator(true);
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
      userId: user.id,
      designDeliveryOptionId:
        formData.job.info.designDeliveryOption?.id ?? null,
      purpose: formData.job.info.purpose ?? null,
      sizeId: formData.job.info.size?.id ?? null,
    });

    // THERE IS AN ERROR HERE THE ACTUAL DATA BEING SENT IS NOT COMPLETE TAKE A LOOK AND FIX
    // {
    //   brandId: "441a09b2-7127-4adf-94bc-e560a11d5c12",
    //   designDescription: "Just make it look good",
    //   jobId: "43bad9d5-9288-4c7a-8d4d-58f72d608932",
    //   platform: "",
    //   referenceImages: [
    //     {
    //       name: "3888309e99418dd0964d6638a5f684f1.jpg",
    //       type: "image/jpeg",
    //       size: "72.73KB",
    //       url: "blob:http://localhost:3000/b9a1a58c-f95f-4ecf-82dc-1bc5f7dea363",
    //     },
    //   ],
    //   service: "Social media design",
    //   userId: "user_2szWfeeXFrQ8PYIc68UveKTwV8b",
    //   designDeliveryOptionId: null,
    //   purpose: "Promotion",
    //   sizeId: "mobile_fullscreen_website",
    // };

    console.log("JOBS", formData.job);

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
      userId: user.id,
      designDeliveryOptionId: formData.job.info.size?.id ?? null,
      purpose: formData.job.info.purpose ?? null,
      sizeId: formData.job.info.size?.id ?? null,
    });

    toast("We have received your job request 😎🥂!");
  }, [
    brandData,
    createJob,
    description,
    images,
    isSignedIn,
    jobId,
    jobInfo,
    user?.id,
    userBrandData,
  ]);

  const shortcutSubmit = async () => {
    if (!userBrandData) {
      setOpenBrandCreator(true);
      return;
    }
  };

  return (
    <div className="flex flex-col gap-4">
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
        />
        <Button className="mt-4 w-full" onClick={handleSubmit}>
          Continue
        </Button>
      </form>
      <BrandCreatorDrawer
        open={openBrandCreator}
        onOpenChange={(b) => setOpenBrandCreator(b)}
        onFinished={(data: BrandSelect) => setBrandData(data)}
      />
    </div>
  );
};

export default DesignInfoForm;
