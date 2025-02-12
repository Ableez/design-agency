"use client";

import { UploadButton, UploadDropzone } from "#/lib/uploadthing";
import { useCallback, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { UploadedImagesCarousel } from "./uploaded-images-carousel";
import { createSocialMediaDesignJob } from "#/server/actions/create-social-media-design-job";
import { toast } from "sonner";
import { ClientUploadedFileData } from "uploadthing/types";
import { SocialFormState } from "../social-media-designs/data";
import { DesignJobData } from "#/types/jobs";
import MiniAuthDrawer from "../auth/mini-auth-drawer";
import { useUser } from "@clerk/nextjs";

type ImageData = {
  url: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
};

const DesignInfoForm: React.FC<{
  jobId: string;
  jobInfo: DesignJobData;
}> = ({ jobId, jobInfo }) => {
  const localStorageDescriptionKey = `designInfoDescription-${jobId}`;
  const localStorageImagesKey = `designInfoImages-${jobId}`;
  const [openAuthDrawer, setOpenAuthDrawer] = useState(false);
  const { user, isSignedIn } = useUser();

  const [description, setDescription] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(localStorageDescriptionKey) ?? "";
    }
    return "";
  });

  const [images, setImages] = useState<ImageData[]>(() => {
    if (typeof window !== "undefined") {
      const storedImages = localStorage.getItem(localStorageImagesKey);
      try {
        return storedImages ? (JSON.parse(storedImages) as ImageData[]) : [];
      } catch (error: unknown) {
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

  const handleBeforeUploadBegin = useCallback((files: File[]) => {
    const newImages = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      previewUrl: URL.createObjectURL(file),
    }));

    console.log("newImages", newImages);

    setImages((prevImages) => [...prevImages, ...newImages]);
    return newImages;
  }, []);

  const handleUploadComplete = useCallback(
    (
      res: ClientUploadedFileData<{
        uploadedBy: string;
      }>[],
    ) => {
      const fileUrls = res.reduce(
        (acc, file) => {
          acc[file.name] = file.url;
          return acc;
        },
        {} as Record<string, string>,
      );

      if (fileUrls) {
        setImages((prevImages) =>
          prevImages.map((image) => {
            const uploadedUrl = fileUrls[image.name];
            return uploadedUrl
              ? {
                  ...image,
                  url: uploadedUrl,
                  previewUrl: undefined,
                }
              : image;
          }),
        );
      }

      toast("Upload complete");
    },
    [],
  );

  const handleRemoveImage = useCallback((imageUrl: string) => {
    setImages((prevImages) =>
      prevImages.filter(
        (img) => img.url !== imageUrl || img.previewUrl !== imageUrl,
      ),
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    console.log("images", images);
    console.log({ description, images });

    if (!isSignedIn) {
      toast("Just one last time, I promise.");
      setOpenAuthDrawer(true);
      return;
    }

    // call the server action you created here
    await createSocialMediaDesignJob({
      size: jobInfo.size ?? "",
      purpose: jobInfo.purpose ?? "",
      platform: jobInfo.platform ?? "",
      deliverySpeed: jobInfo.deliverySpeed ?? "",
      username: jobInfo.userInfo.username,
      email: jobInfo.userInfo.email,
      phone: jobInfo.userInfo.phone,
      brand: jobInfo.userInfo.brand,
      designDescription: description,
      referenceImages: images.map((img) => img.url),
      jobId: jobId,
      timestamp: new Date().toISOString(),
      service: "social-media-design",
    });
  }, [
    description,
    images,
    isSignedIn,
    jobId,
    jobInfo.deliverySpeed,
    jobInfo.platform,
    jobInfo.purpose,
    jobInfo.size,
    jobInfo.userInfo.brand,
    jobInfo.userInfo.email,
    jobInfo.userInfo.phone,
    jobInfo.userInfo.username,
  ]);

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
              onBeforeUploadBegin={(files) => {
                handleBeforeUploadBegin(files);
                toast("Uploading...");
                return files;
              }}
              onClientUploadComplete={handleUploadComplete}
              config={{
                mode: "auto",
              }}
            />
          )}
          {images.length > 0 && (
            <UploadedImagesCarousel
              handleRemoveImage={handleRemoveImage}
              images={images.map((img) => img.previewUrl ?? img.url)}
            />
          )}

          {images.length > 0 && images.length < 5 && (
            <UploadButton
              endpoint="imageUploader"
              onBeforeUploadBegin={(files) => {
                handleBeforeUploadBegin(files);
                return files;
              }}
              onClientUploadComplete={handleUploadComplete}
              config={{
                mode: "auto",
              }}
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
          onChange={handleDescriptionChange}
        />
        <Button className="mt-4 w-full" onClick={handleSubmit}>
          Continue
        </Button>
      </form>
      <MiniAuthDrawer
        open={openAuthDrawer}
        onOpenChange={(b) => setOpenAuthDrawer(b)}
      />
    </div>
  );
};

export default DesignInfoForm;
