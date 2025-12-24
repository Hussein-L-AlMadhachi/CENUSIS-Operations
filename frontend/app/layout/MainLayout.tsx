import type React from "react";
import { type JSX } from "react";
import { ArrowLeftFromLine, LockKeyhole } from "lucide-react";
import { Link } from "wouter"

import UniLogo from "../../public/Assets/logo.jpg"
import { publicRPC } from "@/rpc";
import { navigate } from "wouter/use-browser-location";





interface MainLayoutProps {
    main: React.FC;
    sidebar?: { label: string, link: string, icon: React.FC<{ size: number, strokeWidth: number }> }[];
    title: string;
}

export async function logoutHandler() {
    await publicRPC.logout();
    navigate('/login');
    document.cookie = `auth-role=logggedout;`;
}

export function MainLayout(props: MainLayoutProps): JSX.Element {
    return <div className="drawer lg:drawer-open w-full">

        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">

            {/* Navbar */}
            <nav className="navbar w-[calc(100%-16px)] mr-4 bg-base-300 rounded-full rounded-l-none mt-2 justify-between items-center">
                <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-circle btn-ghost sm:hidden">
                    {/* Sidebar toggle icon */}
                    <ArrowLeftFromLine size={20} strokeWidth={1.5} />
                </label>

                <div className="px-6 text-lg text-gray-600">{props.title}</div>

                <button className="max-sm:pl-20 btn-sm btn-outline btn-circle" onClick={logoutHandler}>
                    <LockKeyhole size={20} strokeWidth={1.5} />
                </button>
            </nav>

            {/* Page content */}
            <div className="py-8 sm:px-16 px-6"> <props.main /> </div>
        </div>

        <div className="drawer-side is-drawer-close:overflow-visible">
            <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="flex min-h-[calc(100vh-8px)] flex-col sm:mt-2 items-start bg-base-200
                is-drawer-close:w-14 is-drawer-open:w-[200px] sm:rounded-full sm:rounded-b-none rounded-2xl md:rounded-b-none">

                {/* Sidebar content */}
                <ul className="menu w-full grow text-base">
                    <li className="is-drawer-open:mb-5 m-1 is-drawer-close:m-0">
                        <label htmlFor="my-drawer-4" aria-label="افتح الشريط الجانبي" className="is-drawer-close:tooltip is-drawer-close:tooltip-left" data-tip="إفتح">
                            {/* Sidebar toggle icon */}
                            <img className="is-drawer-close:h-5 w-full my-2 rounded-full" src={UniLogo} alt="logo" />
                        </label>
                    </li>

                    {props.sidebar?.map((item, index) => (
                        <li key={index}>
                            <Link href={item.link} className="is-drawer-close:tooltip is-drawer-close:tooltip-left" data-tip={item.label}>
                                <item.icon size={20} strokeWidth={1.5} />
                                <span className="is-drawer-close:hidden"> {item.label} </span>
                            </Link>
                        </li>
                    ))}

                </ul>

            </div>
        </div>

    </div>;
}


