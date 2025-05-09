import { DeviceContainer } from '@/components/client/common/DeviceContainer';
import ImageCarousel from '@/components/client/common/ImageCarousel';
import { SkillsPile } from '@/components/client/common/SkillsPile';
import ReactMarkdown from 'react-markdown';

const websiteContent = `
## Studylu E-learning Platform

We created Studylu to help small and medium-sized education centres to build their own e-learning platform. This platform providing over 60000 questions in multiple answering form and subject.

By utilizing **Socket.IO** and **Redis**, we created *real-time process tracking* between students, teachers and parents. This allows parents to monitor their children's progress in real time.

`;
export const Studylu = () => {
  return (
    <div className="flex flex-col gap-4">
      <DeviceContainer url={'https://studylu.com'} deviceType={'browser'}>
        <ImageCarousel
          images={Array.from(new Array(5)).map(
            (_, idx) => `/image/project/studylu/${idx + 1}.png`,
          )}
        />
      </DeviceContainer>
      <ReactMarkdown className={'custom-prose'}>{websiteContent}</ReactMarkdown>

      <SkillsPile
        skills={[
          'React.js',
          'Cloudflare',
          'AWS',
          'Docker',
          'Tailwind CSS',
          'Typescript',
          'Next.js',
          'Storybook',
          'Jest',
          'Elastic Search',
          'Socket.IO',
        ]}
      />
    </div>
  );
};
