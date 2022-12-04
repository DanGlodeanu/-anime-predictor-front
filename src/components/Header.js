import React, { useContext, } from "react";
import { Link } from "react-router-dom";
import { FiLogOut } from 'react-icons/fi';
import { UserContext, } from '../App.js'

function Header(props) {
    const { user, } = useContext(UserContext);

    const getLingks = () => {
        const categories = [
            {
                label: "User Recommendation",
                to: "/user-recommendation",
            },
            {
                label: "Cold Start",
                to: "/cold-start",
            }
        ]

        return categories
            .filter(category => (category.to === "/add-user" && user.type === 1) || category.to !== "/add-user")
            .map((category , idx) => (
                <Link
                    key={ `link-${ idx }` }
                    className="px-8"
                    to={ category.to }>
                    { category.label }
                </Link>
        ))
    }

    return (
        <div className="w-full border-b border-black h-20 px-16 flex text-white2">
            <div className="w-1/4 flex justify-center items-center">
                <Link
                    to="/courses"
                    className="flex justify-center items-center ml-8">
                    <img
                        className="h-10 animate-fade-in-up"
                        alt="logo"
                        src="/anime_logo_1.png" />
                </Link>
            </div>
            <div className="w-3/4 flex justify-end items-center">
                { getLingks() }
            </div>
        </div>
    );
}
  
export default Header;
