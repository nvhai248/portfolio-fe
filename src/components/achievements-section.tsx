"use client";
import React from "react";
import dynamic from "next/dynamic";

// Dynamically import the AnimatedNumbers component
const AnimatedNumbers = dynamic(() => import("react-animated-numbers"), {
  ssr: false,
});

// Define the type for the achievements
interface Achievement {
  prefix?: string;
  metric: string;
  value: string;
  postfix?: string;
}

// List of achievements with the appropriate type
const achievementsList: Achievement[] = [
  {
    metric: "Projects",
    value: "7",
    postfix: "+",
  },
  {
    prefix: "~",
    metric: "Hours Of Code",
    value: "3000",
  },
  {
    metric: "Years",
    value: "1",
    postfix: "+",
  },
];

const AchievementsSection: React.FC = () => {
  return (
    <div className="py-8 px-4 xl:gap-16 sm:py-16 xl:px-16">
      <div className="sm:border-[#33353F] sm:border rounded-md py-8 px-16 flex flex-col sm:flex-row items-center justify-between">
        {achievementsList.map((achievement, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center mx-4 my-4 sm:my-0"
          >
            <h2 className="text-white text-4xl font-bold flex flex-row">
              {achievement.prefix}
              <AnimatedNumbers
                includeComma
                animateToNumber={parseInt(
                  achievement.value.replace(/,/g, ""),
                  10
                )}
                locale="en-US"
                className="text-white text-4xl font-bold"
              />
              {achievement.postfix}
            </h2>
            <p className="text-[#ADB7BE] text-base">{achievement.metric}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsSection;
