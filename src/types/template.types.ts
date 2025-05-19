import { TemplateType, SectionType } from '../generated/prisma';

/**
 * Template data interface matching the frontend structure
 */
export interface TemplateData {
  backgroundColor?: string;
  navbarColor?: string;
  logoName?: string;
  logoColor?: string;
  logoIcon?: string;
  buttonColor?: string;
  fontFamily?: string;
  fontFamilyClass?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  headerTagline?: string;
  headerDescription?: string;
  headerImage?: string;
  titleTextColor?: string;
  subtitleTextColor?: string;
  descriptionTextColor?: string;
  aboutTitle?: string;
  aboutTagline?: string;
  aboutDescription?: string;
  visitText?: string;
  aboutImage?: string;
  aboutButtonColor?: string;
  blogTitle?: string;
  blogContent?: string;
  blogImages?: string[];
  blogButtonColor?: string;
  contactBookingText?: string;
  contactInstagramName?: string;
  contactInstagramLink?: string;
  contactFacebookName?: string;
  contactFacebookLink?: string;
  contactPhone?: string;
  contactPhone2?: string;
  contactEmail?: string;
  contactLocation?: string;
  openTime?: string;
  contactEmailLabel?: string;
  contactSubjectLabel?: string;
  contactMessageLabel?: string;
  contactEmailPlaceholder?: string;
  contactSubjectPlaceholder?: string;
  contactMessagePlaceholder?: string;
  contactSubmitButtonText?: string;
  services?: Array<{
    title: string;
    description: string;
    icon: string;
    uploadedIcon?: string;
  }>;
  menuItems?: {
    appetizers: Array<{
      name: string;
      description: string;
      price: string;
      img: string;
    }>;
    soupsSalads: Array<{
      name: string;
      description: string;
      price: string;
      img: string;
    }>;
    mainCourses: Array<{
      name: string;
      description: string;
      price: string;
      img: string;
    }>;
    desserts: Array<{
      name: string;
      description: string;
      price: string;
      img: string;
    }>;
  };
  chefSpecials?: Array<{
    name: string;
    description: string;
    price: string;
    image: string;
  }>;
  portfolioSlides?: Array<{
    title: string;
    description: string;
    image: string;
  }>;
  portfolioTestimonials?: Array<{ name: string; quote: string; image: string }>;
  portfolioButtonColor?: string;
  navigationLinks?: Array<{ name: string; link: string }>;
  navigationLinksColor?: string;
  backgroundOverlayColor?: string;
  backgroundImage?: string;
  footerDescription?: string;
  footerName?: string;
  aboutDoctorName?: string;
  aboutExtraText?: string;
  ourAchievements?: Array<{
    icon?: string;
    value?: string;
    label?: string;
    uploadedIcon?: string;
    number?: number;
    text?: string;
  }>;
  projects?: {
    [key: string]: Array<{
      name: string;
      img: string;
      uploadedImg?: string;
    }>;
  };
  teamMembers?: Array<{
    name: string;
    role: string;
    img: string;
    uploadedImg?: string;
    instagramLink?: string;
    behanceLink?: string;
    githubLink?: string;
  }>;
  programmerHeaderGreeting?: string;
  programmerHeaderName?: string;
  programmerHeaderRoles?: string[];
  programmerHeaderDescription?: string;
  programmerHeaderButtonText?: string;
  programmerHeaderImage?: string;
  programmerAchievements?: Array<{ num: number; text: string }>;
  programmerAboutTitle?: string;
  programmerAboutDescription?: string;
  programmerAboutImage?: string;
  programmerSkills?: string[];
  programmerEducation?: string[];
  programmerCertifications?: string[];
  programmerProjectsTitle?: string;
  programmerProjects?: Array<{
    title: string;
    description: string;
    image: string;
    tag: string[];
    gitUrl: string;
    previewUrl: string;
  }>;
  programmerContactTitle?: string;
  programmerContactDescription?: string;
  programmerGithubLink?: string;
  programmerLinkedinLink?: string;
  programmerContactEmailLabel?: string;
  programmerContactSubjectLabel?: string;
  programmerContactMessageLabel?: string;
  programmerContactEmailPlaceholder?: string;
  programmerContactSubjectPlaceholder?: string;
  programmerContactMessagePlaceholder?: string;
  programmerContactSubmitButtonText?: string;
  programmerFooterText?: string;
  hireMeButton?: Array<{ text: string; path: string; color: string }>;
  developerHeaderRole?: string;
  developerHeadertitle?: string;
  developerHeadername?: string;
  developerHeaderdescription?: string;
  developerHeaderImage?: string;
  developerHeaderServicesButtonText?: string;
  developerHeaderServicesButtonColor?: string;
  developerInstagramLink?: string;
  developerLinkedinLink?: string;
  developerTwitterLink?: string;
  developerSocialIconsColor?: string;
  developerProjects?: Array<{
    num: string;
    category: string;
    description: string;
    stack: Array<{ name: string }>;
    image: string;
    live: string;
    github: string;
  }>;
  developerServices?: Array<{
    num?: string;
    title?: string;
    description?: string;
    href?: string;
  }>;
  developerResume?: {
    about?: {
      title?: string;
      description?: string;
      info?: Array<{
        fieldName?: string;
        fieldValue?: string;
      }>;
    };
    experience?: {
      icon?: string;
      title?: string;
      description?: string;
      items?: Array<{
        company?: string;
        position?: string;
        duration?: string;
      }>;
    };
    education?: {
      icon?: string;
      title?: string;
      description?: string;
      items?: Array<{
        institution?: string;
        degree?: string;
        duration?: string;
      }>;
    };
    skills?: {
      title?: string;
      description?: string;
      skillList?: Array<{
        name?: string;
        iconType?: "component" | "image";
        imageUrl?: string;
      }>;
    };
  };
  developerInfo?: Array<{
    title?: string;
    description?: string;
  }>;
  userData?: {
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    service?: string;
    message?: string;
  };
  developerContact?: {
    title?: string;
    description?: string;
  };
}

/**
 * Template request for creating a new template
 */
export interface CreateTemplateRequest {
  name: string;
  description?: string;
  templateType: TemplateType;
  isPublic?: boolean;
  templateData?: TemplateData;
}

/**
 * Template update request
 */
export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
  templateType?: TemplateType;
  isPublic?: boolean;
  templateData?: TemplateData;
}

/**
 * Template section request
 */
export interface TemplateSectionRequest {
  name: string;
  sectionType: SectionType;
  sectionData?: any;
  order?: number;
}

/**
 * Media upload request
 */
export interface MediaUploadRequest {
  file: Express.Multer.File;
  templateId?: string;
}

/**
 * Template response
 */
export interface TemplateResponse {
  id: string;
  name: string;
  description?: string;
  templateType: TemplateType;
  isPublic: boolean;
  templateData?: TemplateData;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

/**
 * Template section response
 */
export interface TemplateSectionResponse {
  id: string;
  name: string;
  sectionType: SectionType;
  sectionData?: any;
  order: number;
  templateId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Media response
 */
export interface MediaResponse {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  publicId?: string;
  templateId?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
