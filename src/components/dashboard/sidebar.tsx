"use client";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = ({ menu }: any) => {
  const path = usePathname();
  const routename = path.split("/")[1]; // Extract the base route (e.g., "jobs")
  const pathname = path.split("/")[2]?.toLowerCase().replace(/\s+/g, ""); // Normalize the current path

  return (
    <aside>
      <div className="p-4 bg-[#5B3E81] min-h-screen py-10 w-[250px] sticky top-10  left-0 ">
        {menu.map((m: string) => {
          const normalizedMenuItem = m.toLowerCase().replace(/\s+/g, ""); // Normalize the menu item
          return (
            <Link
              href={`/${routename}/${normalizedMenuItem}`}
              className="block"
              key={m}
            >
              <Button
                variant="secondary"
                className={`${
                  normalizedMenuItem === pathname
                    ? "bg-[#FF0B7E]"
                    : "bg-[#ff0b7d61]"
                } hover:bg-[#FF0B7E] w-[200px] p-6 my-2 text-white text-xl`}
              >
                {m}
              </Button>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;