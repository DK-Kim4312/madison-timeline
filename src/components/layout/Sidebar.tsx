import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import FoodBankOutlinedIcon from '@mui/icons-material/FoodBankOutlined';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function Sidebar({ show, setter }: { show: boolean, setter: React.Dispatch<React.SetStateAction<boolean>> }) {
    // get user login status
    const { isLoading, user } = useKindeBrowserClient();

    // Define our base class
    const className = "bg-white w-[250px] transition-[margin-left] ease-in-out duration-500 fixed md:static top-0 bottom-0 left-0 z-40";
    // Append class based on state of sidebar visiblity
    const appendClass = show ? " ml-0" : " ml-[-250px] md:ml-0";

    // Clickable menu items
    const MenuItem = ({ icon, name, route }: {icon: any, name: string, route: any }) => {
        // Highlight menu item based on currently displayed route

        return (
            <Link
                href={route}
                onClick={() => {
                    setter(oldVal => !oldVal);
                }}
                className={`flex gap-1 [&>*]:my-auto text-md pl-6 py-3 border-b-[1px] border-b-white/10`}
            >
                <div className="text-xl flex [&>*]:mx-auto w-[30px]">
                    {icon}
                </div>
                <div>{name}</div>
            </Link>
        )
    }
    const ModalOverlay = () => (
        <div
            className={`flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-30`}
            onClick={() => {
                setter(oldVal => !oldVal);
            }}
        />
    )

    return (
        <>
            <div className={`${className}${appendClass}`}>
                <div className="p-2 flex flex-row">
                    <Link href="/">
                        {/*eslint-disable-next-line*/}
                        {/* <img src={logo.src} alt="Company Logo" width={300} height={300} /> */}
                        <div className='border rounded-full p-1 bg-[#C5050C] font-bold text-white'>MT</div>
                    </Link>
                    <div className='p-1'>Madison Timeline</div>
                </div>
                <div className="flex flex-col">
                    <MenuItem
                        name="All"
                        route="/boards"
                        icon={<HomeRoundedIcon />}
                    />
                    <MenuItem
                        name="Social"
                        route="/boards/social"
                        icon={<ConnectWithoutContactIcon />}
                    />
                    <MenuItem
                        name="Foods"
                        route="/boards/foods"
                        icon={<FoodBankOutlinedIcon />}
                    />
                    <MenuItem
                        name="Notes"
                        route="/boards/notes"
                        icon={<TextSnippetOutlinedIcon />}
                    />
                    {
                        !user ? (
                            <>
                                <LoginLink>Sign in</LoginLink>
                                <RegisterLink>Sign up</RegisterLink>
                            </>
                        ) : (
                            <LogoutLink>Log out</LogoutLink>
                        )
                    }
                </div>
            </div>
            {show ? <ModalOverlay /> : <></>}
        </>
    )
}