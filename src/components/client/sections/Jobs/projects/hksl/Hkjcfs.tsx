import { SkillsPile } from '@/components/client/common/SkillsPile';
import ReactMarkdown from 'react-markdown';

const websiteContent = `
## HKJC Form System

I've worked on the form system for HKJC, which is used to manage the forms used by the staffs. The system is used to manage the forms and their related documents. It also provides a dashboard for the client to monitor the status of the forms.

This system required to be deployed on multiple location and providing **offline capability**. I've implemented a offline-first architecture within the **Android App**. This allows the staffs to use the system even when they are offline.
`;
export const Hkjcfs = () => {
  return (
    <div className="flex flex-col gap-4">
      <span className="w-full text-center border-default border-2 rounded-lg p-2 bg-strip font-black">
        Confidential Project
      </span>
      <ReactMarkdown className={'custom-prose'}>{websiteContent}</ReactMarkdown>

      <SkillsPile skills={['React.js', 'Kotlin', 'C#', '.net core']} />
    </div>
  );
};
