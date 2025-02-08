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
