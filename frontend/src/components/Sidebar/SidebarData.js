import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
 
export const SidebarData = [
  {
    title: "Workers",
    role: ['Admin'],
    icon: <FaIcons.FaPlaneDeparture />,
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
    title: "Tickets",
    role: ['user'],
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
 
    subNav: [
      {
        title: "Owned",
        path: "/tickets/owned",
        role: ['user']
      }
    ]
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
    role: ["Admin", "User", "Staff"]
}
];