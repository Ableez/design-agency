"use client";

import { useCallback, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { IconLoader2 } from "@tabler/icons-react";
import Image from "next/image";
import { ClientUploadedFileData } from "uploadthing/types";
import { UploadButton, UploadDropzone } from "#/lib/uploadthing";

import type { DesignJobData } from "#/types/jobs";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import BrandCreatorDrawer from "../auth/brand-creator-drawer";
import { UploadedImagesCarousel } from "./uploaded-images-carousel";
import { api } from "#/trpc/react";
import { BrandSelect } from "#/server/db/schema-types";

type ImageStatus = "uploading" | "uploaded" | "failed";

interface ImageData {
  url: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  status: ImageStatus;
  clientId: string;
}

interface DesignInfoFormProps {
  jobId: string;
  jobInfo: DesignJobData;
}

const LOCAL_STORAGE_KEYS = {
  description: (jobId: string) => `designInfoDescription-${jobId}`,
  images: (jobId: string) => `designInfoImages-${jobId}`,
};

const DesignInfoForm: React.FC<DesignInfoFormProps> = ({ jobId, jobInfo }) => {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const { data: userBrandData } = api.brand.getUserBrandByUserId.useQuery();

  // State management
  const [openBrandCreator, setOpenBrandCreator] = useState(false);
  const [openEmailDrawer, setOpenEmailDrawer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [brandData, setBrandData] = useState<BrandSelect[] | null>(
    userBrandData ?? null,
  );
  const [selectedBrand, setSelectedBrand] = useState<BrandSelect | null>(null);
  const [deliveryEmail, setDeliveryEmail] = useState(
    user?.emailAddresses[0]?.emailAddress ?? null,
  );
console.log("BRANDS", userBrandData, selectedBrand)
  // Form state with localStorage persistence
  const [description, setDescription] = useLocalStorageState(
    LOCAL_STORAGE_KEYS.description(jobId),
    "",
  );

  const [images, setImages] = useLocalStorageState<ImageData[]>(
    LOCAL_STORAGE_KEYS.images(jobId),
    [],
    { revokePreviewUrls: true },
  );

  // API mutations
  const createJobMutation = api.designJobs.create.useMutation();

  // Image handling effects
  useEffect(() => {
    return () => {
      images.forEach(({ previewUrl }) => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
      });
    };
  }, [images]);

  // Brand data synchronization
  useEffect(() => {
    if (userBrandData) setBrandData(userBrandData);
  }, [userBrandData]);

  // Event handlers
  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDescription(e.target.value);
    },
    [setDescription],
  );
  

  const handleRemoveImage = useCallback(
    (clientId: string) => {
      setImages((prev) => {
        const removed = prev.find((img) => img.clientId === clientId);
        if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
        return prev.filter((img) => img.clientId !== clientId);
      });
    },
    [setImages],
  );

  const handleImageUpload = {
    before: (files: File[]) => {
      const newImages = files.map((file) => ({
        clientId: uuidv4(),
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl: URL.createObjectURL(file),
        url: "",
        status: "uploading" as const,
      }));
      setImages((prev) => [...prev, ...newImages]);
      return files;
    },
    complete: (res: ClientUploadedFileData<{ customId: string }>[]) => {
      const updates = res.map(({ name, url }) => ({ name, url }));
      setImages((prev) =>
        prev.map((img) => {
          const update = updates.find((u) => u.name === img.name);
          if (!update) return img;
          if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
          return {
            ...img,
            url: update.url,
            status: "uploaded",
            previewUrl: undefined,
          };
        }),
      );
      toast.success("Images uploaded successfully");
    },
    error: (error: Error) => {
      toast.error("Image upload failed");
      setImages((prev) =>
        prev.map((img) =>
          img.status === "uploading"
            ? { ...img, status: "failed", previewUrl: undefined }
            : img,
        ),
      );
    },
  };

  // Helper functions
  const validateSubmission = useCallback(() => {
    if ((!isSignedIn && !brandData) || !userBrandData || !selectedBrand) {
      toast.info("Please create a brand account to continue");
      setOpenBrandCreator(true);
      return false;
    }

    if (!deliveryEmail) {
      toast.info("Please provide a delivery email address");
      setOpenEmailDrawer(true);
      return false;
    }

    return true;
  }, [brandData, deliveryEmail, isSignedIn, selectedBrand, userBrandData]);

  const prepareSubmissionData = useCallback(
    () => ({
      job: { id: jobId, ...jobInfo },
      description: { content: description, length: description.length },
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
        isSignedIn,
        brandExists: !!brandData,
        userId: user?.id,
      },
    }),
    [brandData, description, images, isSignedIn, jobId, jobInfo, user?.id],
  );

  const submitJob = useCallback(
    async (data: ReturnType<typeof prepareSubmissionData>) => {
      await createJobMutation.mutateAsync({
        brandId: selectedBrand!.id!,
        designDescription: data.description.content,
        jobId: data.job.id,
        platform: data.job.platform,
        referenceImages: data.media.images,
        service: data.job.service,
        userId: user?.id ?? null,
        designDeliveryOptionId: data.job.size?.id ?? null,
        purpose: data.job.purpose ?? null,
        sizeId: data.job.size?.id ?? null,
        deliveryDate: new Date().toISOString(),
        deliveryEmail: deliveryEmail!,
        deliveryDurationInHours:
          data.job.designDeliveryOption?.durationInHours ?? 0,
      });
    },
    [createJobMutation, deliveryEmail, selectedBrand, user?.id],
  );

  const handlePostSubmissionNavigation = useCallback(() => {
    isSignedIn ? router.push("/") : router.push("/sign-in");
  }, [isSignedIn, router]);

  // Form submission
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      if (!validateSubmission()) return;

      const formData = prepareSubmissionData();
      await submitJob(formData);

      handlePostSubmissionNavigation();
      toast.success("Job submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit job");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    handlePostSubmissionNavigation,
    prepareSubmissionData,
    submitJob,
    validateSubmission,
  ]);

  return (
    <div className="flex flex-col gap-4">
      {/* Brand Display Section */}
      {brandData?.map((brand) => <BrandDisplay key={brand.id} brand={brand} />)}

      {/* Image Upload Section */}
      <ImageUploadSection
        images={images}
        isSubmitting={isSubmitting}
        onRemoveImage={handleRemoveImage}
        onUploadBefore={handleImageUpload.before}
        onUploadComplete={handleImageUpload.complete}
        onUploadError={handleImageUpload.error}
      />

      {/* Description Input */}
      <FormSection title="Description*">
        <Textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Describe your design requirements..."
          disabled={isSubmitting}
          className="resize-none"
        />
      </FormSection>

      {/* Submission Button */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-4 w-full"
      >
        {isSubmitting ? (
          <IconLoader2 className="animate-spin" size={16} />
        ) : (
          "Submit Design Request"
        )}
      </Button>

      {/* Modals and Drawers */}
      <BrandCreatorDrawer
        open={openBrandCreator}
        onOpenChange={setOpenBrandCreator}
        onFinished={setSelectedBrand}
        deliveryEmail={deliveryEmail}
        handleDeliveryEmailChange={setDeliveryEmail}
      />

      <EmailDrawer
        open={openEmailDrawer}
        onOpenChange={setOpenEmailDrawer}
        email={deliveryEmail}
        onEmailChange={setDeliveryEmail}
      />
    </div>
  );
};

// Helper components
const BrandDisplay: React.FC<{ brand: BrandSelect }> = ({ brand }) => (
  <div className="relative mb-8 p-8">
    <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 scale-[1.01] rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-orange-600 p-7 opacity-40 blur-sm" />
    <div className="absolute left-1/2 top-1/2 z-10 flex w-full -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-2xl border p-2 px-4 dark:border-neutral-600 dark:bg-neutral-950">
      <Image
        src={brand.logo ?? "/favicon.png"}
        alt="Brand logo"
        width={30}
        height={30}
        className="opacity-60 grayscale"
      />
      <h4 className="text-lg font-semibold capitalize">{brand.name}</h4>
    </div>
  </div>
);

const ImageUploadSection: React.FC<{
  images: ImageData[];
  isSubmitting: boolean;
  onRemoveImage: (clientId: string) => void;
  onUploadBefore: (files: File[]) => File[];
  onUploadComplete: (
    res: ClientUploadedFileData<{ customId: string }>[],
  ) => void;
  onUploadError: (error: Error) => void;
}> = ({ onRemoveImage, images, isSubmitting, ...uploadHandlers }) => (
  <FormSection title="Add images (optional)">
    {images.length === 0 ? (
      <UploadDropzone
        endpoint="imageUploader"
        disabled={isSubmitting}
        config={{ mode: "auto" }}
        {...uploadHandlers}
      />
    ) : (
      <>
        <UploadedImagesCarousel
          images={images.map((img) => ({
            url: img.previewUrl || img.url,
            status: img.status,
            clientId: img.clientId,
          }))}
          handleRemoveImage={onRemoveImage}
        />
        {images.length < 5 && (
          <UploadButton
            endpoint="imageUploader"
            disabled={isSubmitting}
            config={{ mode: "auto" }}
            {...uploadHandlers}
          />
        )}
      </>
    )}
  </FormSection>
);

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div>
    <h4 className="mb-1 pl-1 text-sm font-medium text-neutral-500">{title}</h4>
    {children}
  </div>
);

const EmailDrawer: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string | null;
  onEmailChange: (email: string) => void;
}> = ({ open, onOpenChange, email, onEmailChange }) => (
  <Drawer open={open} onOpenChange={onOpenChange}>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Delivery Email Address</DrawerTitle>
      </DrawerHeader>
      <div className="flex flex-col gap-4 p-4 pb-16">
        <Input
          value={email ?? ""}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Enter your email address"
          type="email"
        />
        <Button onClick={() => onOpenChange(false)}>Confirm Email</Button>
      </div>
    </DrawerContent>
  </Drawer>
);

// Custom hook for localStorage state management
const useLocalStorageState = <T,>(
  key: string,
  initialValue: T,
  options?: { revokePreviewUrls?: boolean },
) => {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  useEffect(() => {
    if (!options?.revokePreviewUrls) return;
    return () => {
      if (Array.isArray(state)) {
        state.forEach((item) => {
          if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
        });
      }
    };
  }, [state, options?.revokePreviewUrls]);

  return [state, setState] as const;
};

export default DesignInfoForm;
