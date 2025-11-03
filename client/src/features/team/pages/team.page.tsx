import { motion } from 'motion/react';
import { Github, Linkedin, Twitter, Instagram } from 'lucide-react';

import { MainNavbar } from '@/ui/organisms/navbar.organism';
import { createStaggerContainer, fadeIn, fadeInUp } from '@/lib/utils/motion.util';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/atoms/card';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  focusAreas: string[];
  avatar: string;
  availability?: string;
  social: {
    github: string;
    linkedin: string;
    twitter?: string;
    instagram?: string;
  };
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Rahman Nurudin',
    role: 'Product & Backend',
    bio: 'Handles backend architecture, API integration, and AI feature pipelines for LoLo.',
    focusAreas: ['Data Pipelines', 'LLM Prompts', 'Product Calls'],
    avatar: 'https://avatars.githubusercontent.com/u/93178373?size=128',
    availability: 'Available for remote fullstack roles (Web / Mobile / Backend)',
    social: {
      github: 'https://github.com/TraFost',
      linkedin: 'https://www.linkedin.com/in/rahmannrdn/',
      twitter: 'https://x.com/Nurudin1Rahman',
      instagram: 'http://instagram.com/rahmannrdn',
    },
  },
  {
    name: 'Galih Aditya',
    role: 'Design & Frontend',
    bio: 'Designs user flows, builds frontend components, and maintains the visual consistency of LoLo.',
    focusAreas: ['UX Flows', 'Frontend Development', 'UI Polish'],
    avatar: 'https://avatars.githubusercontent.com/u/113889106?size=128',
    availability: 'Open to frontend web (React / Next.js) roles',
    social: {
      github: 'https://github.com/samsulpanjul',
      linkedin: 'https://www.linkedin.com/in/galih-aditya-8914a6216/',
    },
  },
];

const heroContainer = createStaggerContainer(0.16, 0.14);

const SOCIAL_ICON_COMPONENTS = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
} as const;

const SOCIAL_ORDER: Array<keyof TeamMember['social']> = [
  'github',
  'linkedin',
  'twitter',
  'instagram',
];

export function TeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <MainNavbar />
      <motion.section
        initial="hidden"
        animate="visible"
        variants={heroContainer}
        className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-24 sm:px-6 md:py-28 lg:px-8"
      >
        <motion.div variants={fadeIn} className="flex flex-col gap-4 text-center md:text-left">
          <motion.span
            variants={fadeInUp}
            className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70"
          >
            Meet the Team
          </motion.span>
          <motion.h1
            variants={fadeInUp}
            className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight text-white"
          >
            We're a team of two developers
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-base text-slate-300/80 sm:text-lg">
            LoLo was built for the DevPost Rift-Rewind 2025 Hackathon
          </motion.p>
        </motion.div>

        <motion.div
          variants={createStaggerContainer(0.1, 0.12)}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {TEAM_MEMBERS.map((member) => (
            <motion.div key={member.name} variants={fadeInUp}>
              <Card className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition duration-200 hover:border-primary/40">
                <CardHeader className="px-0 pb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={member.avatar}
                      alt={`${member.name} avatar`}
                      className="h-16 w-16 rounded-full border border-white/10 object-cover"
                    />
                    <div>
                      <CardTitle className="text-2xl font-semibold text-white">
                        {member.name}
                      </CardTitle>
                      <CardDescription className="text-xs font-medium uppercase tracking-[0.24em] text-slate-300/70">
                        {member.role}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col px-0">
                  <p className="text-sm text-slate-200/90 sm:text-base">{member.bio}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {member.focusAreas.map((area) => (
                      <span
                        key={area}
                        className="rounded-full border border-white/10 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-wide text-slate-100/70"
                      >
                        {area}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {SOCIAL_ORDER.map((key) => {
                      const url = member.social[key];
                      if (!url) return null;
                      const Icon = SOCIAL_ICON_COMPONENTS[key];
                      return (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={`${member.name} on ${key}`}
                          title={`${member.name} on ${key}`}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-200 transition hover:border-primary/50 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                        >
                          <Icon className="h-4 w-4" />
                        </a>
                      );
                    })}
                  </div>

                  {member.availability ? (
                    <div className="mt-6 border-t border-white/5 pt-3 text-xs text-slate-400/80">
                      {member.availability}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  );
}
