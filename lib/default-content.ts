import { PERSONAL_INFO, PROJECTS } from "./data";
import type { SiteContentData } from "./types";

export const DEFAULT_PROFILE_IMAGE = "/personal/me.png";

export const DEFAULT_SITE_CONTENT: SiteContentData = {
	name: PERSONAL_INFO.name,
	role: PERSONAL_INFO.role,
	email: PERSONAL_INFO.email,
	location: PERSONAL_INFO.location,
	about: PERSONAL_INFO.about,
	profileImage: DEFAULT_PROFILE_IMAGE,
	social: { ...PERSONAL_INFO.social },
	stats: {
		yearsExperience: 4,
		projectsCompleted: PROJECTS.length,
		awards: 5,
		clients: 8,
	},
	education: PERSONAL_INFO.education.map((item) => ({ ...item })),
	experience: PERSONAL_INFO.experience.map((item) => ({
		role: item.role,
		company: item.company,
		period: item.period,
		details: item.details ? [...item.details] : undefined,
	})),
	skills: [...PERSONAL_INFO.skills],
	languages: ["English", "Hindi", "Marathi", "Telugu"],
	workshops: [
		"Umbrella Workshop, Prathamesh Rahalkar — 2018",
		"Ar. Sanjay Patil Talk Series — 2019",
		"Impression of City, Aarti Badamikar — 2019",
		"Bamboo Workshop, Ar. Chandrashekar Kondabattin — 2022",
		"Cob Calling Workshop, Ar. Kiranraj Kumar, Bangalore",
	],
	competitions: [
		"WIT4 Bank Designing, Solapur — 2nd Place, 2018",
		"Architerrax Portfolio Competition — 2021",
		"IIA Navi Mumbai Race Track Design — Top 12 Finalist, 2023",
		"Asia Young Designer Award Entry Submitted — 2023",
	],
};
