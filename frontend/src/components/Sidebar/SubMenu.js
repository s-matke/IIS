import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import AuthContext from "../../store/production/AuthContext";
 
const SidebarLink = styled(Link)`
  display: flex;
  color: #e1e9fc;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 18px;
 
  &:hover {
    background: #252831;
    border-left: 4px solid white;
    cursor: pointer;
  }
`;
 
const SidebarLabel = styled.span`
  margin-left: 16px;
`;
 
const DropdownLink = styled(Link)`
  background: #252831;
  height: 60px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5f5;
  font-size: 18px;
 
  &:hover {
    background: gray;
    cursor: pointer;
  }
`;
 
const SubMenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);
  const context = useContext(AuthContext);
  const showSubnav = () => setSubnav(!subnav);

  const isLogout = item.title === "Sign Out" ? true : false
  console.log("IS LOGOUT: ", isLogout)
  console.log("ITEM: ", item)
   
  return (
    <div>

    { isLogout ? (
      <SidebarLink to={item.path}
      onClick={context.logout}>
        <div>
          {item.icon}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </SidebarLink>
    ) : (
      <SidebarLink to={item.path}
      onClick={item.subNav && showSubnav}>
        <div>
          {item.icon}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </SidebarLink>
    )}

      {subnav && 
        item.subNav.map((item, index) => {
            if (item.role.some(r => context.role.includes(r))) {
                return (
                  <DropdownLink to={item.path} key={index}>
                        {item.icon}
                        <SidebarLabel>{item.title}</SidebarLabel>
                    </DropdownLink>
                );
              }  
            })}
            </div>
  );
};
 
export default SubMenu;