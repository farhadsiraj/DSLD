import React, { useState } from 'react';
import styled from 'styled-components';
import GlobalStyles from '../GlobalStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

export default function NavBar() {
  const [hamburgerDropdown, setHamburgerDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();

  async function handleLogout() {
    setError('');

    try {
      await logout();
    } catch (error) {
      setError('Failed to log out');
    }
  }

  return (
    <Container>
      <GlobalStyles />
      <NavItem style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
        <FontAwesomeIcon
          icon={hamburgerDropdown ? faTimes : faBars}
          onClick={function () {
            setHamburgerDropdown(!hamburgerDropdown);
            setUserDropdown(false);
          }}
          style={{ fontSize: '1.7rem' }}
        />
        {hamburgerDropdown ? (
          <Dropdown>
            {!currentUser ? (
              <>
                <DropdownItem>
                  {' '}
                  <Link
                    to="/"
                    onClick={function () {
                      setHamburgerDropdown(false);
                    }}
                  >
                    Home
                  </Link>
                </DropdownItem>
              </>
            ) : (
              <>
                <DropdownItem>
                  {' '}
                  <Link
                    to="/"
                    onClick={function () {
                      setHamburgerDropdown(false);
                    }}
                  >
                    Home
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link
                    to="/exercise-form"
                    onClick={function () {
                      setHamburgerDropdown(false);
                    }}
                  >
                    Start Workout
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link
                    onClick={function () {
                      setHamburgerDropdown(!hamburgerDropdown);
                    }}
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>
                </DropdownItem>
              </>
            )}
          </Dropdown>
        ) : (
          ''
        )}
      </NavItem>

      <Logo
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '.3rem',
        }}
      >
        <Link to="/" className="link-reset hover-reset">
          DSLD
        </Link>
      </Logo>
      <NavItem style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
        <FontAwesomeIcon
          onClick={function () {
            setUserDropdown(!userDropdown);
            setHamburgerDropdown(false);
          }}
          icon={userDropdown ? faTimes : faUser}
          style={{ fontSize: '1.5rem' }}
        />
        {userDropdown ? (
          <DropdownRight>
            {!currentUser ? (
              <>
                <DropdownItem>
                  <Link
                    to="/login"
                    onClick={function () {
                      setUserDropdown(!userDropdown);
                    }}
                  >
                    Login
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link
                    to="/signup"
                    onClick={function () {
                      setUserDropdown(!userDropdown);
                    }}
                  >
                    Sign Up
                  </Link>
                </DropdownItem>
              </>
            ) : (
              <>
                <DropdownItem>
                  <Link
                    onClick={function () {
                      setUserDropdown(!userDropdown);
                      handleLogout();
                    }}
                    to="/"
                  >
                    Logout
                  </Link>
                </DropdownItem>
              </>
            )}
          </DropdownRight>
        ) : (
          ''
        )}
      </NavItem>
    </Container>
  );
}

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
`;

const NavItem = styled.div`
  display: flex;
  padding: 1rem;
  width: 33%;
  color: #f26627;
  @media only screen and (min-width: 540px) {
    padding: 0 2.5rem;
  }
`;

const Dropdown = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 9;
  left: 0;
  top: 65px;
  background-color: rgba(255, 255, 255, 0.9);
  width: 100%;
  height: 100%;
  padding: 0 1rem 0 1rem;

  @media only screen and (min-width: 540px) {
    padding: 0 2.5rem;
    width: 30%;
  }
  @media only screen and (max-width: 540px) {
    align-items: center;
    padding-top: 40%;
  }
`;

const DropdownRight = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 9;
  left: 70%;
  top: 65px;
  background-color: rgba(255, 255, 255, 0.9);
  width: 100%;
  height: 100%;
  padding: 0 1rem 0 1rem;
  align-items: center;

  @media only screen and (min-width: 540px) {
    padding: 0 2.5rem;
    width: 30%;
    align-items: flex-end;
  }
  @media only screen and (max-width: 540px) {
    left: 0;
    padding-top: 40%;
  }
`;

const DropdownItem = styled.div`
  color: #f26627;
  font-size: 1.7rem;
  padding-top: 0.5rem;
`;
const Logo = styled.div`
  display: flex;
  width: 33%;
  color: #f26627;
  font-family: 'Sansita', sans-serif;
  font-size: 3rem;
`;
