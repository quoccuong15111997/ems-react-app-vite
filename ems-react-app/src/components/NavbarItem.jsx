import React from 'react'

const NavbarItem = (props) => {
  console.log(JSON.stringify(props.navItem));
  return (
    <a href="#" className={props.customClass}>
      {props.navItem.title}
    </a>
  );
};

export default NavbarItem