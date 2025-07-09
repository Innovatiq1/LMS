// enquiry.model.ts

// Ensure these are being exported
export interface SiteEnquiryModel {
    _id: string;
    siteName: string;
    email: string;
    message: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ThirdPartyEnquiryModel {
    _id: string;
    companyName: string;
    contactPerson: string;
    contactEmail: string;
    enquiryText: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface SitePaginationModel {
    page: number;
    limit: number;
    search: string;
    docs: SiteEnquiryModel[];
    totalCount: number;
    filterText: string;
    sortBy: string;
    sortByDirection: string;
  }
  
  export interface ThirdPartyPaginationModel {
    page: number;
    limit: number;
    search: string;
    docs: ThirdPartyEnquiryModel[];
    totalCount: number;
    filterText: string;
    sortBy: string;
    sortByDirection: string;
  }
  