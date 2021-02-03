import React, { useState } from 'react'
import styled from 'styled-components'

const Container = styled.nav`
  display: flex;
  width: 100%;
  height: 65px;
  justify-content: space-between;
  flex-grow: 1;
`

const NavItem = styled.div`
  display: flex;
  /* flex-basis: 33% */
  padding: 1rem;
  width: 33%;
`

const Dropdown = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 9;
  left: 0;
  top: 65px;
  background-color: #fff;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s,
    z-index 0s linear 0.01s;
`
const DropdownItem = styled.div`
  color: #355c7d;
`

export default function NavBar() {
  const [hamburgerDropdown, setHamburgerDropdown] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)

  return (
    <Container>
      <NavItem
        onClick={function () {
          setHamburgerDropdown(!hamburgerDropdown)
          setUserDropdown(false)
        }}
        style={{ justifyContent: 'flex-start', alignItems: 'center' }}
      >
        DSLD
        {hamburgerDropdown ? (
          <Dropdown>
            <DropdownItem>Link</DropdownItem>
            <DropdownItem>Link</DropdownItem>
            <DropdownItem>Link</DropdownItem>
          </Dropdown>
        ) : (
          ''
        )}
      </NavItem>
      <NavItem style={{ justifyContent: 'center', alignItems: 'center' }}>
        DSLD
      </NavItem>
      <NavItem
        onClick={function () {
          setUserDropdown(!userDropdown)
          setHamburgerDropdown(false)
        }}
        style={{ justifyContent: 'flex-end', alignItems: 'center' }}
      >
        DSLD
        {userDropdown ? (
          <Dropdown>
            <DropdownItem>Login</DropdownItem>
            <DropdownItem>Signup</DropdownItem>
          </Dropdown>
        ) : (
          ''
        )}
      </NavItem>
    </Container>
  )
}
