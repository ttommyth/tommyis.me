"use client";
export const skills=[
  {
    name: "React.js",
    image: "/image/skill/react.png",
  },
  {
    name: "Next.js",
    image: "/image/skill/nextjs.png"
  },
  {
    name: "Tailwind CSS",
    image: "/image/skill/tailwindcss.png"
  },
  {
    name: "Expo",
    image: "/image/skill/expo.png"
  },
  {
    name: "AWS",
    image: "/image/skill/aws.png",
    weight: 0.7
  },
  {
    name: "React Native",
    image: "/image/skill/react.png",
    weight: 0.5
  },
  {
    name: "Docker",
    image: "/image/skill/docker.png"
  },
  {
    name: "Cloudflare",
    image: "/image/skill/cloudflare.png",
    weight: 0.7
  },
  {
    name: "C#",
    image: "/image/skill/csharp.png"
  },
  {
    name: "Typescript",
    image: "/image/skill/typescript.png"
  },
  {
    name: "Jest",
    image: "/image/skill/jest.png",
    weight: 0.5
  },
  {
    name: ".net core",
    image: "/image/skill/dotnetcore.png",
    weight: 0.5
  },
  {
    name: "Kotlin",
    image: "/image/skill/kotlin.png",
    weight: 0.5
  },
  {
    name: "Playwright",
    image: "/image/skill/playwright.png",
    weight: 0.6,
  },
  {
    name: "Raspberry PI",
    image: "/image/skill/rpi.png",
    weight: 0.5
  },
  {
    name: "Storybook",
    image: "/image/skill/storybook.png",
    weight: 0.7
  },
  {
    name: "Nx",
    image: "/image/skill/nx.png"
  },
  {
    name: "Cura",
    image: "/image/skill/cura.png",
    weight: 0.5
  },
  {
    name: "Elastic Search",
    image: "/image/skill/elasticsearch.png",
    weight: 0.7
  },
  {
    name: "Rabbit MQ",
    image: "/image/skill/rabbitmq.png",
    weight: 0.5
  },
  {
    name: "Socket.IO",
    image: "/image/skill/socketio.png",
    weight: 0.5
  },
  {
    name: "Firebase",
    image: "/image/skill/firebase.png",
    weight: 0.7
  }
] as const
export const readonlySkills: readonly {readonly name:string,readonly image:string,readonly weight?:number}[] = skills;
export const skillsDict = Object.fromEntries(readonlySkills.map((skill)=>[skill.name, skill]));