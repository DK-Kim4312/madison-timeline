import React, { useState } from 'react'
import Head from 'next/head'
import Sidebar from '@/components/layout/Sidebar.tsx';

import MenuBarMobile from './MenuBarMobile';

export default function Layout({ pageTitle, children }) {

    // Mobile sidebar visibility state
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <>
            <div className="min-h-screen">
                <div className="flex">
                    <MenuBarMobile setter={setShowSidebar} />
                    <Sidebar show={showSidebar} setter={setShowSidebar} />
                    <div className="flex flex-col flex-grow bg-white w-screen md:w-full min-h-screen">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}