import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="footer border z-10 border-t-[#33353F] border-l-transparent border-r-transparent text-white">
      <div className="container p-10 flex justify-between">
        <div className="text-4xl md:text-5xl flex text-white font-semibold ml-3 md:ml-44">
          <Image
            src={"/images/logo.png"}
            className="mt-[-20px] mb-[-20px]"
            alt="logo"
            width={100}
            height={100}
          />
          <span className="mt-3 md:mt-2">NVHAI248</span>
        </div>
        <p className="text-white text-xl hidden md:block md:mt-4">
          © Copy right 2024 @ nvhai248
        </p>
      </div>
    </footer>
  );
};

export default Footer;
