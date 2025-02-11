export interface JobData {
  jobId: string;
  timestamp: string;
  service: string;
  designDescription: string;
  referenceImages: string[];
  designFiles: string[];
  userInfo: {
    username: string;
    email: string;
    phone: string;
    brand: string;
  };
}



export type DesignOrderType = { 
  id: string;
  size: string;
  purpose: string;
  platform: string;
  deliverySpeed: string;
  jobId: string;
  timestamp: string;
  service: string;
  designDescription: string;
  referenceImages: string;
  designFiles: string | null;
  username: string;
  email: string;
  phone: string;
  brand: string;
  userId: string | null;
};
