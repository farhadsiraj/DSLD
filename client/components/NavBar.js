import React, { useState } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes, faUser } from '@fortawesome/free-solid-svg-icons'

const Container = styled.nav`
  display: flex;
  position: fixed;
  top: 0;
  width: 100%;
  height: 65px;
  justify-content: space-between;
  flex-grow: 1;
  box-shadow: 0 0.1rem 0.8rem 0 rgba(0, 0, 0, 0.19);
  z-index: 9;
  background-color: white;
`

const NavItem = styled.div`
  display: flex;
  padding: 1rem;
  width: 33%;
  color: #f26627;
`

const Dropdown = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 9;
  left: 0;
  top: 7vh;
  background-color: white;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s,
    z-index 0s linear 0.01s;
`
const DropdownItem = styled.div`
  color: #f26627;
  font-size: 1.7rem;
  padding: 0.5rem 1rem 0 1rem;
`

export default function NavBar() {
  const [hamburgerDropdown, setHamburgerDropdown] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)

  return (
    <Container>
      <NavItem style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
        <FontAwesomeIcon
          icon={hamburgerDropdown ? faTimes : faBars}
          onClick={function () {
            setHamburgerDropdown(!hamburgerDropdown)
            setUserDropdown(false)
          }}
          style={{ fontSize: '1.7rem' }}
        />
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
      <NavItem style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
        <FontAwesomeIcon
          onClick={function () {
            setUserDropdown(!userDropdown)
            setHamburgerDropdown(false)
          }}
          icon={userDropdown ? faTimes : faUser}
          style={{ fontSize: '1.5rem' }}
        />
        {userDropdown ? (
          <Dropdown
            style={{
              alignItems: 'flex-end',
            }}
          >
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
