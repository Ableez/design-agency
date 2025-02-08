"use client";
import { UploadButton, UploadDropzone } from "#/lib/uploadthing";
import { useCallback, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { UploadedImagesCarousel } from "./uploaded-images-carousel";

type ImageData = {
  url: string;
  name: string;
  size: number;
  type: string;
};

const SESSION_STORAGE_DESCRIPTION_KEY = "designInfoDescription";
const SESSION_STORAGE_IMAGES_KEY = "designInfoImages";

const DesignInfoForm: React.FC = () => {
  const [description, setDescription] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(SESSION_STORAGE_DESCRIPTION_KEY) ?? "";
    }
    return "";
  });
  const [images, setImages] = useState<ImageData[]>(() => {
    if (typeof window !== "undefined") {
      const storedImages = sessionStorage.getItem(SESSION_STORAGE_IMAGES_KEY);
      try {
        return storedImages ? (JSON.parse(storedImages) as ImageData[]) : [];
      } catch (error) {
        console.error("Error parsing stored images:", error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    sessionStorage.setItem(SESSION_STORAGE_DESCRIPTION_KEY, description);
  }, [description]);

  useEffect(() => {
    sessionStorage.setItem(SESSION_STORAGE_IMAGES_KEY, JSON.stringify(images));
  }, [images]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem(SESSION_STORAGE_DESCRIPTION_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_IMAGES_KEY);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDescription(e.target.value);
    },
    [],
  );

  const handleUploadComplete = useCallback((files: ImageData[]) => {
    const extractedFiles: ImageData[] = files.map((file) => ({
      name: file.name,
      url: file.url,
      size: file.size,
      type: file.type,
    }));
    setImages((prevImages) => [...prevImages, ...extractedFiles]);
  }, []);

  const handleSubmit = useCallback(() => {
    console.log("images", images);
    console.log({ description, images });
  }, [description, images]);

  return (
    <div className="flex flex-col gap-4">
      <form>
        <h4 className="mb-1 pl-1 text-sm font-medium text-neutral-500">
          Add image: Optional
        </h4>
        <div>
          {images.length === 0 && (
            <UploadDropzone
              endpoint={"imageUploader"}
              onClientUploadComplete={handleUploadComplete}
              config={{
                mode: "auto",
              }}
            />
          )}
          {images.length > 1 && (
            <UploadedImagesCarousel images={images.map((img) => img.url)} />
          )}
          {images.length > 1 && images.length < 5 && (
            <UploadButton
              onClientUploadComplete={handleUploadComplete}
              endpoint={"imageUploader"}
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
