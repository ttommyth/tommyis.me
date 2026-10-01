'use client';
import { githubLink, kofiLink, linkedinLink } from '@/data/contact';
import { Variants, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import GithubLogo from 'public/icon/github.svg';
import KofiLogo from 'public/icon/kofi.svg';
import LinkedinLogo from 'public/icon/linkedin.svg';
import job from 'public/image/job_developer.png';
import { FC } from 'react';
import { VerticalRoll } from '../common/VerticalRoll';

const easeOutQuint: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOutQuint },
  },
};

const imageItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.3, ease: easeOutQuint },
  },
};

export const Hero: FC<{
  locale: {
    title1: string;
    title2: string;
    iam: string;
    iamArray: string[];
  };
}> = (props) => {
  const { locale } = props;
  return (
    <div className="w-[100dvw]">
      <div className="left-0 w-[100dvw] h-[100dvh] absolute flex items-center bg-dotted min-h-[500px]">
        <div className="mx-auto container max-w-4xl flex flex-col sm:flex-row justify-between items-center px-4">
          <motion.div
            className="flex flex-col gap-2 grow"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.p variants={item}>{locale.title1}</motion.p>
            <motion.h1 variants={item} className="text-6xl font-black">
              {locale.title2}
            </motion.h1>
            <motion.span variants={item} className="flex gap-2">
              {locale.iam} <VerticalRoll messages={locale.iamArray} />
            </motion.span>
            <motion.ul variants={item} className="flex gap-2 mt-4">
              <li>
                <Link
                  href={githubLink}
                  target="_blank"
                  className="interact block"
                >
                  <GithubLogo className="w-8 h-8 fill-current " />{' '}
                </Link>
              </li>
              <li>
                <Link
                  href={linkedinLink}
                  target="_blank"
                  className="interact block"
                >
                  <LinkedinLogo className="w-8 h-8 fill-current" />{' '}
                </Link>
              </li>
              <li>
                <Link
                  href={kofiLink}
                  target="_blank"
                  className="interact block"
                >
                  <KofiLogo className="w-8 h-8 fill-current" />{' '}
                </Link>
              </li>
            </motion.ul>
          </motion.div>
          <motion.div
            className="w-72 relative"
            variants={imageItem}
            initial="hidden"
            animate="show"
          >
            <Image
              src={job}
              className="w-full object-cover"
              alt={'Developer'}
              priority
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
export default Hero;
