// Personal details used across the site. Edit this file to change them everywhere.
// Do not add a phone number or home address here.
export const SITE = {
  name: 'Nachiket Dandekar',
  shortName: 'Nacho Dandekar',
  nickname: 'Nacho',
  title: 'Nacho Dandekar',
  description:
    'Electrical engineering student at UTSA. FPGA, low-latency systems and chip design projects, with the numbers I measured.',
  email: 'nachitrex@gmail.com',
  github: 'https://github.com/nachiket-dandekar',
  linkedin: 'https://www.linkedin.com/in/nacho-d-5bb422362',
  // Put your resume at public/resume.pdf. The download links appear only when that file exists.
  resumeFile: 'resume.pdf',
};

// Tags used to filter projects.
export const TAGS = ['FPGA', 'ASIC', 'PCB', 'embedded', 'software'] as const;
export type Tag = (typeof TAGS)[number];
/** CSS color variable for a topic, e.g. var(--t-fpga). Used for the dots in "Working on now". */
export const topicVar = (t: Tag) => `var(--t-${t.toLowerCase()})`;

