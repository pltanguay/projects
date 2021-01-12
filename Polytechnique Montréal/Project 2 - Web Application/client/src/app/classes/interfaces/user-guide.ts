interface SectionContent {
    description: string;
    fileName?: string;
    fileTitle?: string;
}

export interface UserGuideItem {
    title: string;
    number?: string;
    subtitle?: UserGuideItem[];
    sections?: SectionContent[];
}
