"use client";
import React, { useTransition, useState } from "react";
import Image from "next/image";
import TabButton from "./tab-button";

interface TabData {
  title: string;
  id: string;
  content: React.ReactNode;
}

const TAB_DATA: TabData[] = [
  {
    title: "Skills",
    id: "skills",
    content: (
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 list-disc pl-2">
        <li>Nest.js</li>
        <li>Next.js</li>
        <li>Golang, Gin - Gonic</li>
        <li>Express.js</li>
        <li>PostgreSQL, MySQL</li>
        <li>MongoDB, Redis</li>
        <li>Sequelize, Prisma</li>
        <li>JavaScript</li>
        <li>React</li>
        <li>CI/CD</li>
        <li>AWS S3/ EC2</li>
      </ul>
    ),
  },
  {
    title: "Education",
    id: "education",
    content: (
      <ul className="list-disc space-y-1 pl-2">
        <li>Fullstack Academy of Code</li>
        <li>Ho Chi Minh University of Science, Ho Chi Minh</li>
      </ul>
    ),
  },
  {
    title: "Certifications",
    id: "certifications",
    content: (
      <ul className="list-disc space-y-1 pl-2">
        <li className="hover:text-blue-500">
          {" "}
          <a href="https://www.hackerrank.com/certificates/e0af258cea9c">
            JavaScript (Intermediate) Certificate - Hackerrank
          </a>
        </li>
        <li className="hover:text-blue-500">
          <a href="https://www.hackerrank.com/certificates/c13ad18d3539">
            JavaScript (Basic) Certificate - Hackerrank
          </a>
        </li>
      </ul>
    ),
  },
];

const AboutSection: React.FC = () => {
  const [tab, setTab] = useState("skills");
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (id: string) => {
    startTransition(() => {
      setTab(id);
    });
  };

  const selectedTab = TAB_DATA.find((t) => t.id === tab);

  return (
    <section className="text-white" id="about">
      <div className="md:grid md:grid-cols-2 gap-8 items-center py-8 px-4 xl:gap-16 sm:py-16 xl:px-16">
        <Image
          src="/images/about-image.png"
          width={500}
          height={500}
          alt="about"
        />
        <div className="mt-4 md:mt-0 text-left flex flex-col h-full">
          <h2 className="text-4xl font-bold text-white mb-4">About Me</h2>
          <p className="text-base lg:text-lg">
            As a full stack web developer, I am passionate about creating
            interactive and responsive web applications. My experience includes
            working with JavaScript, React, Next.js, and NestJS. On the backend,
            I have worked with Express, PostgreSQL, Sequelize, and Prisma. I am
            proficient in HTML, CSS, and Git. <br /> In addition to my
            development skills, I have hands-on experience with DevOps,
            including setting up CI/CD pipelines using GitHub and Azure DevOps.
            I am also familiar with deployment platforms like Vercel and Render,
            as well as various AWS services such as S3, EC2, and CloudFront.{" "}
            <br /> I am a quick learner, always eager to expand my knowledge and
            skill set. I thrive in team environments and am excited to
            collaborate with others to create outstanding applications.
          </p>
          <div className="flex flex-row justify-start mt-8">
            <TabButton
              selectTab={() => handleTabChange("skills")}
              active={tab === "skills"}
            >
              Skills
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("education")}
              active={tab === "education"}
            >
              Education
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("certifications")}
              active={tab === "certifications"}
            >
              Certifications
            </TabButton>
          </div>
          <div className="mt-8">
            {selectedTab?.content || <div>Tab content not found</div>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
