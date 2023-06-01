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
    title: "Machine",
    role: ['Admin'],
    icon: <FaIcons.FaUserCog />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
 
    subNav: [
      {
        title: "Create",
        path: "/machine/create",
        icon: <IoIcons.IoMdCreate />,
        role: ['Admin']
      },
      {
        title: "Search",
        path: "/machine/search",
        icon: <IoIcons.IoIosSearch />,
        role: ['Admin']
      },
    ],
  },
  {
    title: "Production",
    role: ['Worker', 'User', 'Plan Manager', 'Production Manager'],
    icon: <FaIcons.FaUserCog />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
 
    subNav: [
      {
        title: "Plan",
        path: "/production/plan",
        icon: <IoIcons.IoMdCreate />,
        role: ['Worker', 'Plan Manager']
      },
      {
        title: "Search",
        path: "/production/plan/search",
        icon: <IoIcons.IoIosSearch />,
        role: ['User', 'Worker', 'Plan Manager', 'Production Manager']
      },
      {
        title: "Order",
        path: "/production/order/search",
        icon: <IoIcons.IoMdCodeWorking/>,
        role: ['Production Manager']
      },
      {
        title: "Progress",
        path: "/production/order/progress",
        icon: <FaIcons.FaBatteryHalf/>,
        role: ['Production Manager']
      }
    ],
  },
  {
    title: "Product",
    role: ['Worker', 'Plan Manager', 'Inventory Manager', 'Admin', 'Production Manager'],
    icon: <FaIcons.FaCarBattery />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
 
    subNav: [
      {
        title: "Add",
        path: "/product/create",
        icon: <IoIcons.IoMdCreate />,
        role: ['Worker', 'Inventory Manager']
      },
      {
        title: "Search",
        path: "/product/search",
        icon: <IoIcons.IoIosSearch />,
        role: ['User', 'Worker', 'Plan Manager', 'Inventory Manager', 'Admin', 'Production Manager']
      },
    ],
  },
  {
    title: "Material",
    role: ['Worker', 'Plan Manager', 'Inventory Manager', 'Admin', 'Production Manager'],
    icon: <FaIcons.FaTools />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
 
    subNav: [
      {
        title: "Add",
        path: "/material/create",
        icon: <IoIcons.IoMdCreate />,
        role: ['Inventory Manager']
      },
      {
        title: "Search",
        path: "/material/search",
        icon: <IoIcons.IoIosSearch />,
        role: ['User', 'Worker', 'Plan Manager', 'Inventory Manager', 'Admin', 'Production Manager']
      },
      {
        title: "Order",
        path: "/material/order/create",
        icon: <FaIcons.FaTruck />,
        role: ['Inventory Manager']
      },
    ],
  },
  {
    title: "Inventory",
    role: ['Worker', 'Plan Manager', 'Inventory Manager', 'Admin', 'Production Manager'],
    icon: <FaIcons.FaBoxes />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
 
    subNav: [
      {
        title: "Product",
        path: "/inventory/products",
        icon: <IoIcons.IoMdCreate />,
        role: ['Plan Manager', 'Inventory Manager', 'Admin', 'Production Manager']
      },
      {
        title: "Material",
        path: "/inventory/materials",
        icon: <IoIcons.IoIosSearch />,
        role: ['User', 'Worker', 'Plan Manager', 'Inventory Manager', 'Admin', 'Production Manager']
      },
    ],
  },
  {
    title: "Sign In",
    path: "/signin",
    role: ['guest'],
    icon: <FaIcons.FaSignInAlt />,//<IoIcons.IoIosLogIn />,
  },
  {
    title: "Sign Out",
    path: "/",
    cName: "nav-text",
    role: ["Admin", "User", "Worker", "Plan Manager", 'Inventory Manager', 'Production Manager']
}
];