import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
 
export const SidebarData = [
  {
    title: "Workers",
    role: ['Admin'],
    icon: <FaIcons.FaUserCog />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
 
    subNav: [
      {
        title: "Create",
        path: "/worker/create",
        icon: <IoIcons.IoMdCreate />,
        role: ['Admin']
      },
      {
        title: "Search",
        path: "/worker/search",
        icon: <IoIcons.IoIosSearch />,
        role: ['Admin']
      },
    ],
  },
  {
    title: "Production",
    role: ['Worker', 'User'],
    icon: <FaIcons.FaUserCog />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
 
    subNav: [
      {
        title: "Plan",
        path: "/production/plan",
        icon: <IoIcons.IoMdCreate />,
        role: ['Worker']
      },
      {
        title: "Search",
        path: "/production/search",
        icon: <IoIcons.IoIosSearch />,
        role: ['User', 'Worker']
      },
    ],
  },
  {
    title: "Sign In",
    path: "/signin",
    role: ['guest'],
    icon: <FaIcons.FaSignInAlt />,//<IoIcons.IoIosLogIn />,
  },
  // {
  //   title: "Sign Up",
  //   path: "/signup",
  //   role: ['guest'],
  //   // icon: < />,//<IoIcons.IoIosLogIn />,
  // },
  {
    title: "Sign Out",
    path: "/signout",
    cName: "nav-text",
    role: ["Admin", "User", "Worker"]
}
];