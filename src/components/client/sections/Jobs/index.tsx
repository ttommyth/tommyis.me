'use client';
import { useState } from 'react';
import {
  EducationNode,
  JobNode,
  JobSpacer,
  PersonalProjectNode,
  ProjectNode,
  TodoNode,
} from './Nodes';
import { ChannelC } from './projects/ct/ChannelC';
import { CtLoan } from './projects/ct/CtLoan';
import { Kitchee } from './projects/ct/Kitchee';
import { Studylu } from './projects/ct/Studylu';
import { Ams } from './projects/hksl/Ams';
import { Hkha } from './projects/hksl/Hkha';
import { Hkjcfs } from './projects/hksl/Hkjcfs';

export const Jobs = () => {
  const [expanded, setExpanded] = useState<undefined | number>(undefined);
  let expandIndex = 0;
  return (
    <div className=" overflow-y-auto sm:overflow-y-auto min-h-[100dvh] max-h-[100dvh] sm:max-h-none">
      <div className="flex flex-col pt-appbar sm:pt-0 w-[100dvw] sm:w-full items-center overflow-x-hidden">
        <h2 className="text-4xl mb-8">My Work</h2>
        <div className="ml-8 sm:ml-8 p-4 pl-6 pr-8 border-l-2 border-default w-full h-auto relative flex flex-col  transition-colors gap-8">
          <TodoNode />
          <JobNode
            job={{
              title: 'Senior Software Engineer [Full Stack (Frontend)]',
              company: 'Lalamove',
              url: 'https://lalamove.com',
              period: '12/2023 - now',
            }}
            variant="lalamove"
          />
          <ProjectNode
            project={{
              name: 'web.lalamove.com',
              labels: ['Website'],
              period: '',
            }}
            i={expandIndex++}
            expanded={expanded}
            setExpanded={setExpanded}
            showExpand={false}
          />
          <JobSpacer />
          <JobNode
            job={{
              title: 'Senior System Analyst',
              company: 'Cooltech Solutions Limited',
              url: 'https://cooltechsol.com',
              period: '07/2022 - 10/2023',
            }}
          />
          <ProjectNode
            project={{
              icon: '/image/project/cc/icon.png',
              name: 'Channel C HK',
              url: 'https://channelchk.com',
              labels: ['Website', 'Mobile App', 'Backend', 'Data Analysis'],
              period: '2021 - 2023',
            }}
            i={expandIndex++}
            expanded={expanded}
            setExpanded={setExpanded}
          >
            <ChannelC />
          </ProjectNode>
          <ProjectNode
            project={{
              icon: '/image/project/kitchee/icon.png',
              name: 'Kitchee',
              url: 'https://kitchee.com',
              labels: ['Website', 'CMS Customization'],
              period: '2022 - 2023',
            }}
            i={expandIndex++}
            expanded={expanded}
            setExpanded={setExpanded}
          >
            <Kitchee />
          </ProjectNode>
          <ProjectNode
            project={{
              icon: '/image/project/studylu/icon.png',
              name: 'Studylu',
              url: 'https://studylu.com',
              labels: ['Website', 'Backend'],
              period: '2021 - 2023',
            }}
            i={expandIndex++}
            expanded={expanded}
            setExpanded={setExpanded}
          >
            <Studylu />
          </ProjectNode>
          <ProjectNode
            project={{
              name: 'Loan Management System',
              labels: ['Website', 'Backend'],
              period: '2021 - 2023',
              confidential: true,
            }}
            i={expandIndex++}
            expanded={expanded}
            setExpanded={setExpanded}
          >
            <CtLoan />
          </ProjectNode>
          <JobSpacer />
          <JobNode
            job={{
              title: 'System Analyst',
              company: 'Cooltech Solutions Limited',
              url: 'https://cooltechsol.com',
              period: '07/2021 - 06/2022',
            }}
          />
          <JobNode
            job={{
              title: 'Analyst Programmer',
              company: 'HK Systems Limited',
              url: 'https://hksl.com.hk',
              period: '10/2018 - 07/2021',
            }}
          />
          <ProjectNode
            project={{
              icon: '/image/project/hkjc/icon.png',
              name: 'HKJC Form System',
              labels: ['Website', 'Mobile App', 'Backend'],
              period: '2019 - 2021',
              confidential: true,
            }}
            i={expandIndex++}
            expanded={expanded}
            setExpanded={setExpanded}
          >
            <Hkjcfs />
          </ProjectNode>
          <ProjectNode
            project={{
              icon: '/image/project/hkha/icon.png',
              name: 'HKHA Internal RFID System',
              labels: ['Desktop App', 'Mobile App', 'Backend'],
              period: '2020 - 2021',
              confidential: true,
            }}
            i={expandIndex++}
            expanded={expanded}
            setExpanded={setExpanded}
          >
            <Hkha />
          </ProjectNode>
          <ProjectNode
            project={{
              name: 'Asset Management System',
              labels: ['Mobile App', 'Backend'],
              period: '2018 - 2021',
              confidential: true,
            }}
            i={expandIndex++}
            expanded={expanded}
            setExpanded={setExpanded}
          >
            <Ams />
          </ProjectNode>
          <PersonalProjectNode
            project={{
              title: 'Custom Robot Controller with AR Mobile App',
              company: 'City University of Hong Kong',
              url: 'http://dspace.cityu.edu.hk/handle/2031/9098',
              period: '07/2018 - 08/2018',
            }}
            i={expandIndex++}
            expanded={expanded}
            setExpanded={setExpanded}
          />
          <JobNode
            job={{
              title: 'Programmer',
              company: 'HK Systems Limited',
              url: 'https://hksl.com.hk',
              period: '08/2017 - 06/2018',
            }}
          />
          <JobSpacer />
          <EducationNode
            education={{
              title: 'BSc Computer Science',
              school: 'City University of Hong Kong',
              gpa: '3.47/4.3',
              period: '09/2016 - 08/2018',
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default Jobs;
