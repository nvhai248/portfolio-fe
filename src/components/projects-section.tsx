"use client";
import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import ProjectTag from "./project-tag";
import ProjectCard from "./project-card";

const projectsData = [
  {
    id: 1,
    title: "E-commerce Shopp Website",
    description:
      "NextJS, NestJS, Prisma, Graphql, Redis, PostgreSQL, NextAuth,...",
    image: "/images/projects/1.png",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/nvhai248/Shopp",
    previewUrl: "https://hshopp.vercel.app/",
  },
  {
    id: 2,
    title: "Backend TopDev Clone",
    description:
      "ExpressJS, PostgreSQL, Microservices, Gateway, gRPC, Redis, MongoDB,...",
    image: "/images/projects/2.png",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/nvhai248/TopDevCloneBE",
    previewUrl: "https://topdevclone.netlify.app/",
  },
  {
    id: 3,
    title: "Asset Management",
    description:
      "NextJS, NestJS, PostgreSQL, CI/CD pipelines, Azure Devops, Azure Container Registry, Azure Web App,...",
    image: "/images/projects/3.png",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/the-middle-nine/asset-management-fe",
    previewUrl: "https://asset-management-fe.vercel.app/",
  },
  {
    id: 4,
    title: "Clazzroom",
    description:
      "ReactJS, ExpressJS, RabbitMQ, Docker, MongoDB, PubSub, AWS S3,...",
    image: "/images/projects/4.png",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/hienhack/Clazzroom",
    previewUrl: "https://clazzroom.vercel.app/sign-in",
  },
  {
    id: 5,
    title: "Backend Best Habit",
    description:
      "Golang, Gin - Gonic, Passport, OAuth, PubSub, Cronjob, MySQL,...",
    image: "/images/projects/6.png",
    tag: ["All", "Mobile"],
    gitUrl: "https://github.com/nvhai248/BE-BestHabit",
    previewUrl: "https://github.com/nvhai248/BE-BestHabit",
  },
];

const ProjectsSection = () => {
  const [tag, setTag] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handleTagChange = (newTag: any) => {
    setTag(newTag);
  };

  const filteredProjects = projectsData.filter((project) =>
    project.tag.includes(tag)
  );

  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <section id="projects">
      <h2 className="text-center text-4xl font-bold text-white mt-4 mb-8 md:mb-12">
        My Projects
      </h2>
      <div className="text-white flex flex-row justify-center items-center gap-2 py-6">
        <ProjectTag
          onClick={handleTagChange}
          name="All"
          isSelected={tag === "All"}
        />
        <ProjectTag
          onClick={handleTagChange}
          name="Web"
          isSelected={tag === "Web"}
        />
        <ProjectTag
          onClick={handleTagChange}
          name="Mobile"
          isSelected={tag === "Mobile"}
        />
      </div>
      <ul ref={ref} className="grid md:grid-cols-3 gap-8 md:gap-12">
        {filteredProjects.map((project, index) => (
          <motion.li
            key={index}
            variants={cardVariants}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            transition={{ duration: 0.3, delay: index * 0.4 }}
          >
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              imgUrl={project.image}
              gitUrl={project.gitUrl}
              previewUrl={project.previewUrl}
            />
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default ProjectsSection;
