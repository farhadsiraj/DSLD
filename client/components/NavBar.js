import React, { useState } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

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
  top: 65px;
  background-color: white;
  width: 100%;
  height: 100%;
`
const DropdownItem = styled.div`
  color: #f26627;
  font-size: 1.7rem;
  padding: 0.5rem 1rem 0 1rem;
`
const Logo = styled.div`
  display: flex;
  width: 33%;
  color: #f26627;
  font-family: 'Sansita', sans-serif;
  font-size: 3rem;
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
            <DropdownItem>
              {' '}
              <Link
                to="/"
                onClick={function () {
                  setHamburgerDropdown(false)
                }}
              >
                Home
              </Link>
            </DropdownItem>
            <DropdownItem>
              <Link
                to="/formcheck"
                onClick={function () {
                  setHamburgerDropdown(false)
                }}
              >
                Formcheck
              </Link>
            </DropdownItem>
          </Dropdown>
        ) : (
          ''
        )}
      </NavItem>
      <Logo style={{ justifyContent: 'center', alignItems: 'center' }}>
        DSLD
      </Logo>
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
            <DropdownItem>
              <Link
                to="/login"
                onClick={function () {
                  setUserDropdown(!userDropdown)
                }}
              >
                Login
              </Link>
            </DropdownItem>
            <DropdownItem>
              <Link
                to="/createaccount"
                onClick={function () {
                  setUserDropdown(!userDropdown)
                }}
              >
                Create an Account
              </Link>
            </DropdownItem>
          </Dropdown>
        ) : (
          ''
        )}
      </NavItem>
    </Container>
  )
}
