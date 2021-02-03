import React from 'react'
import styled from 'styled-components'

const Container = styled.nav`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 0.7rem;
`

const NavItem = styled.div`
  width: 1rem;
  height: 1rem;
  /* flex-basis: 33% */
`

const Dropdown = styled.div`
  display: flex;
  flex-direction: column;
`
const DropdownItem = styled.div`
  color: #355c7d;
`

export default function NavBar() {
  return (
    <Container>
      <NavItem>
        Hamburger
        <Dropdown>
          <DropdownItem>Link</DropdownItem>
          <DropdownItem>Link</DropdownItem>
          <DropdownItem>Link</DropdownItem>
        </Dropdown>
      </NavItem>
      <NavItem>DSLD</NavItem>
      <NavItem>
        Signup
        <Dropdown>
          <DropdownItem>Login</DropdownItem>
          <DropdownItem>Signup</DropdownItem>
        </Dropdown>
      </NavItem>
    </Container>
  )
}
