import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { v4 } from "uuid";
import { metadata } from "../../layout";

const f = createUploadthing();

const getUser = async (req: Request) => await currentUser();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "16MB",
      maxFileCount: 4,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      const user = await getUser(req);
      if (!user) throw new Error("[UPLOADTHING]: Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, customId: v4() };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
