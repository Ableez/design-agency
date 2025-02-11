"use client";

import { UploadButton, UploadDropzone } from "#/lib/uploadthing";
import { useCallback, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { UploadedImagesCarousel } from "./uploaded-images-carousel";
import { toast } from "sonner";
import { createSocialMediaDesignJob } from "#/server/actions/create-social-media-design-job";
import type { SocialFormState } from "#/app/social-media-design/page";

type ImageData = {
  url: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
};

const DesignInfoForm: React.FC<{
  jobId: string;
  socialMediaDesignJobInfo: SocialFormState;
}> = ({ jobId, socialMediaDesignJobInfo }) => {
  const localStorageDescriptionKey = `designInfoDescription-${jobId}`;
  const localStorageImagesKey = `designInfoImages-${jobId}`;

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

    setImages((prevImages) => [...prevImages, ...newImages]);
    return newImages;
  }, []);

  const handleUploadComplete = useCallback(
    (fileUrls: Record<string, string> | undefined) => {
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
    },
    [],
  );

  const handleRemoveImage = useCallback((imageUrl: string) => {
    setImages((prevImages) => prevImages.filter((img) => img.url !== imageUrl));
  }, []);

  const handleSubmit = useCallback(async () => {
    console.log("images", images);
    console.log({ description, images });

    // call the server action you created here
    await createSocialMediaDesignJob({
      size: socialMediaDesignJobInfo.size ?? "",
      purpose: socialMediaDesignJobInfo.purpose ?? "",
      platform: socialMediaDesignJobInfo.platform ?? "",
      deliverySpeed: socialMediaDesignJobInfo.deliverySpeed ?? "",
      username: socialMediaDesignJobInfo.userInfo.username,
      email: socialMediaDesignJobInfo.userInfo.email,
      phone: socialMediaDesignJobInfo.userInfo.phone,
      brand: socialMediaDesignJobInfo.userInfo.brand,
      designDescription: description,
      referenceImages: images.map((img) => img.url),
      jobId: jobId,
      timestamp: new Date().toISOString(),
      service: "social-media-design",
    });
  }, [
    description,
    images,
    jobId,
    socialMediaDesignJobInfo.deliverySpeed,
    socialMediaDesignJobInfo.platform,
    socialMediaDesignJobInfo.purpose,
    socialMediaDesignJobInfo.size,
    socialMediaDesignJobInfo.userInfo.brand,
    socialMediaDesignJobInfo.userInfo.email,
    socialMediaDesignJobInfo.userInfo.phone,
    socialMediaDesignJobInfo.userInfo.username,
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
                return files;
              }}
              onUploadProgress={(n: number) => {
                toast(`Uploading ${n.toFixed(0)}%`, {
                  dismissible: n < 1,
                  duration: n < 1 ? 99999999999 : undefined,
                });
              }}
              onClientUploadComplete={(res) => {
                const recs = res.reduce(
                  (acc, file) => {
                    acc[file.name] = file.url;
                    return acc;
                  },
                  {} as Record<string, string>,
                );
                handleUploadComplete(recs);
              }}
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
              onUploadProgress={(n: number) => {
                toast(`Uploading ${n.toFixed(0)}%`, {
                  dismissible: n < 1,
                  duration: n < 1 ? 0 : undefined,
                  id: "image-upload-progress",
                });
              }}
              onClientUploadComplete={(res) => {
                const recs = res.reduce(
                  (acc, file) => {
                    acc[file.name] = file.url;
                    return acc;
                  },
                  {} as Record<string, string>,
                );
                handleUploadComplete(recs);
              }}
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
    </div>
  );
};

export default DesignInfoForm;
