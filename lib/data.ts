export const PERSONAL_INFO = {
	name: "SANKET VITTAL BIJJA",
	role: "Junior Architect",
	email: "sanketbijja1805@gmail.com",
	location: "Solapur, Maharashtra",
	social: {
		issuu: "https://issuu.com/sankevtbijja",
		instagram: "https://instagram.com/arch_sanket_bijja",
		linkedin: "http://www.linkedin.com/in/sanket-bijja-062592184",
	},
	about: `I, SANKET BIJJA SEEKING A PLACE FOR A POST OF JUNIOR ARCHITECT TO MAXIMISE MY KNOWLEDGE, SKILLS AND ABILITIES IN ALL ASPECTS. I WOULD LIKE TO TAKE THIS OPPORTUNITY AS A PLATFORM TO SHOWCASE MY CREATIVITY IN DESIGN, COMMUNICATION, TEAMWORK AND LEADERSHIP SKILLS. OPEN ENVIRONMENT AND STAY CLOSE TO NATURE INSPIRES AND MOTIVATES ME. IT GIVES ME IMMENSE PLEASURE TO WORK WITH UTMOST PROFESSIONALISM. ACCURACY AND TIME CONCIOUSNESS ARE MY KEY FACTORS. I HEREBY ENSURE TO MAKE SIGNIFICANT CONTRIBUTION TO YOUR FIRM WITH MY DEDICATION AND DETERMINATION.`,
	education: [
		{ year: "2023", degree: "BACHELOR OF ARCHITECTURE", school: "S.E.S. College of Architecture, Solapur" },
		{ year: "2017", degree: "HIGHER SECONDARY EDUCATION", school: "D.B.F. Dayanand College of Arts & Science, Solapur" },
	],
	experience: [
		{
			role: "Jr. Interior designer",
			company: "VYKA Design, Bengaluru",
			period: "JAN 2024 - MAY 2025",
		},
		{
			role: "Trainee",
			company: "Studio AAD",
			period: "2023 (4 MONTHS)",
		},
		{
			role: "Intern",
			company: "SATHYA CONSULTANTS, Bengaluru",
			period: "AUG 2022 - DEC 2022",
			details: ["Detailed CAD drawings", "Handmade cardboard model", "3D Sketches"],
		},
		{
			role: "Freelance Architect",
			company: "Self Employed",
			period: "2022 - Present",
			details: ["Interior Work for Mrs. & Mr. Shendge (2022)", "Interior Work for Mrs. & Mr. Dhingane (2023)", "Interior Work for Dr. Pratik Mule (2024)"],
		},
	],
	skills: ["Design Development", "Fast Drafting", "Rendering", "Hand Graphics", "Walk-through", "Model Making", "AutoCAD", "SketchUp", "V-Ray", "Lumion", "Photoshop", "Revit", "Rhino", "InDesign"],
};

// Helper to generate numbered image paths
const generateImages = (folder: string, count: number, ext: string = "png", numbers?: number[]): string[] => {
	const nums = numbers || Array.from({ length: count }, (_, i) => i + 1);
	return nums.map((n) => `/projects/${folder}/${n}.${ext}`);
};

// Note: Paths are case and space sensitive.
export const PROJECTS: Project[] = [
	{
		id: "commercial-office",
		title: "Commercial Office",
		category: "Commercial",
		cover: "/projects/commercial office /1.png",
		images: generateImages("commercial office ", 18, "png", [1, 2, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]),
	},
	{
		id: "mr-shoaib",
		title: "Mr. Shoaib Residence",
		category: "Residential",
		cover: "/projects/Mr. Shoaib/1.png",
		images: generateImages("Mr. Shoaib", 29, "png", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 29]),
	},
	{
		id: "mr-vivek-reddy",
		title: "Mr. Vivek Reddy",
		category: "Residential",
		cover: "/projects/Mr. Vivek  reddy /1.jpg",
		images: generateImages("Mr. Vivek  reddy ", 16, "jpg"),
	},
	{
		id: "mr-arun-gupta",
		title: "Mr. Arun Gupta",
		category: "Residential",
		cover: "/projects/Mr.Arun gupta/1.jpg",
		images: generateImages("Mr.Arun gupta", 5, "jpg"),
	},
	{
		id: "mr-balaji",
		title: "Mr. Balaji, Bangalore",
		category: "Residential",
		cover: "/projects/Mr.Balaji, Banglaore/1.jpg",
		images: [
			"/projects/Mr.Balaji, Banglaore/1.jpg",
			"/projects/Mr.Balaji, Banglaore/2.jpg",
			"/projects/Mr.Balaji, Banglaore/3.jpg",
			"/projects/Mr.Balaji, Banglaore/4.jpg",
			"/projects/Mr.Balaji, Banglaore/5.png",
		],
	},
	{
		id: "mr-harish",
		title: "Mr. Harish Residence",
		category: "Residential",
		cover: "/projects/Mr.Harish/1.jpg",
		images: generateImages("Mr.Harish", 20, "jpg"),
	},
	{
		id: "mr-mitra",
		title: "Mr. Mitra",
		category: "Residential",
		cover: "/projects/Mr.Mitra /1.png",
		images: generateImages("Mr.Mitra ", 15, "png", [1, 2, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
	},
	{
		id: "mrs-rajini",
		title: "Mrs. Rajini",
		category: "Residential",
		cover: "/projects/Mrs.Rajini /1.jpg",
		images: [
			...generateImages("Mrs.Rajini ", 13, "jpg"),
			"/projects/Mrs.Rajini /14.png",
			"/projects/Mrs.Rajini /15.jpg",
			"/projects/Mrs.Rajini /16.png",
			"/projects/Mrs.Rajini /17.jpg",
			"/projects/Mrs.Rajini /18.png",
		],
	},
	{
		id: "mrs-santosh",
		title: "Mrs. Santosh",
		category: "Residential",
		cover: "/projects/Mrs.Santosh /1.png",
		images: generateImages("Mrs.Santosh ", 31, "png"),
	},
];

export type Project = {
	id: string;
	title: string;
	category: string;
	cover: string;
	images: string[];
};
