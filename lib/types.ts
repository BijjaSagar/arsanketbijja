export type EducationItem = {
	year: string;
	degree: string;
	school: string;
};

export type ExperienceItem = {
	role: string;
	company: string;
	period: string;
	details?: string[];
};

export type SiteStats = {
	yearsExperience: number;
	projectsCompleted: number;
	awards: number;
	clients: number;
};

export type SiteSocial = {
	issuu: string;
	instagram: string;
	linkedin: string;
};

export type SiteContentData = {
	name: string;
	role: string;
	email: string;
	location: string;
	about: string;
	profileImage: string;
	social: SiteSocial;
	stats: SiteStats;
	education: EducationItem[];
	experience: ExperienceItem[];
	skills: string[];
	languages: string[];
	workshops: string[];
	competitions: string[];
};

export type CmsProject = {
	id: string;
	slug: string;
	title: string;
	category: string;
	cover: string;
	description: string;
	sortOrder: number;
	published: boolean;
	images: string[];
};

export type PublicProject = {
	id: string;
	title: string;
	category: string;
	cover: string;
	images: string[];
	description?: string;
};
