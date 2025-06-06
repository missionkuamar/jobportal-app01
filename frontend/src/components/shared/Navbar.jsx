import React from "react";
import { Link } from "react-router-dom";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export const Navbar = () => {
  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        <div>
          <h1 className="text-2xl font-bold">
            JOB <span className="text-[#F83002]">Portal</span>
          </h1>
        </div>
        <div className="flex items-center gap-12">
          <ul className="flex font-medium items-center gap-5">
            <li>Home</li>
            <li>Jobs</li>
            <li>Companies</li>
            <li>About</li>
            <li>Contact</li>
          </ul>

          <Popover>
            <PopoverTrigger>
              <Avatar className="cursor-pointer w-6 h-7">
                <AvatarImage src="https://github.com/shadcn.png" />
              </Avatar>
            </PopoverTrigger>
            <PopoverContent>
<div className="flex gap-4 space-y-2">
    <Avatar className="cursor-pointer w-6 h-7">
                <AvatarImage src="https://github.com/shadcn.png" />
              </Avatar>
    <div>

<h4 className="font-medium">Mission mern stack</h4>
<p className="tex-sm text-muted-foreground">lorew isomninopinpon npidnp np np np niobniouibi h uhoifnioh nncph 98 98he npuvjk;o n</p>

    </div>
</div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
