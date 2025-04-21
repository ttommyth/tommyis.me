import { githubLink, kofiLink, linkedinLink } from '@/data/contact';
import Image from 'next/image';
import Link from 'next/link';
import GithubLogo from 'public/icon/github.svg';
import KofiLogo from 'public/icon/kofi.svg';
import LinkedinLogo from 'public/icon/linkedin.svg';
import job from 'public/image/job_developer.png';
import { FC } from 'react';
import { VerticalRoll } from '../common/VerticalRoll';

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
          <div className="flex flex-col gap-2 grow">
            <h2>{locale.title1}</h2>
            <h1 className="text-6xl font-black">{locale.title2}</h1>
            <span className="flex items-bottom gap-2">
              {locale.iam} <VerticalRoll messages={locale.iamArray} />
            </span>
            <ul className="flex gap-2 mt-4">
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
            </ul>
          </div>
          <div className="w-72 relative">
            <Image
              src={job}
              className="w-full object-cover"
              alt={'Developer'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;
