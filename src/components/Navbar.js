import React from "react";
import styled from "styled-components";

const Nav = styled.nav`
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    height: 3rem;
    display: flex;
    justify-content: left;
    padding: 0.2rem calc((100vw - 1000px) / 2);
    z-index: 12;
    margin-bottom: 1rem;
    padding-left: 1rem;
`;

const NavLink = styled.div`
    color: #FCF3D9;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: clamp(0rem, 1vw, 2rem);
    height: 100%;
    cursor: pointer;
    font-weight: 300;
    ${props => props.isActive ? `
        color: #213052;
        font-weight: 500;
    ` : ''}
    font-family: "Publico";
    font-size: clamp(1rem, 1.6dvw, 2rem);
`;

const NavMenu = styled.div`
    display: flex;
    align-items: center;
`;

const Navbar = ({ page, setPage }) => {
    return (
        <>
            <Nav>
                <NavMenu>
                    <NavLink isActive={page === "home"} onClick={() => setPage("home")}>
                        Home
                    </NavLink>
                    <NavLink isActive={page === "about"} onClick={() => setPage("about")}>
                        About Me
                    </NavLink>
                    <NavLink isActive={page === "learnings"} onClick={() => setPage("learnings")}>
                        What I Hope to Learn
                    </NavLink>
                    <NavLink isActive={page === "projects"} onClick={() => setPage("projects")}>
                        Portfolio Projects
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};

export default Navbar;