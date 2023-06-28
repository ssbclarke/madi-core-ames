import { FC } from "react";
import Image from "next/image";

export const Navbar: FC = () => {
  return (
    <div className="flex h-[70px] sm:h-[70px] bg-neutral py-2 px-2 sm:px-8 items-center justify-between">
      <div className="font-bold text-3xl flex items-center">
        <Image className="mask mask-circle" src="/cas2.jpeg" alt="CAS logo" width={55} height={55}/>
        <a className="ml-2 hover:opacity-50 font-thin">
          <em>CAS Generative A.I. Assistant</em>
        </a>
      </div>
    </div>
  );
};
