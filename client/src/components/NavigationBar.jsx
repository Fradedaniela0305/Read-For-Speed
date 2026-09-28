import { NavLink } from "react-router-dom";

export default function NavigationBar() {
    return (
        <nav className="flex justify-center items-center gap-[72px] py-[30px] w-full box-border sticky top-0 z-[1000] bg-nav-bg border-b border-accent shadow-[0_4px_30px_rgba(0,0,0,0.6),inset_0_-1px_0_rgba(255,255,255,0.04)]">
            <NavLink to="/train" className="relative no-underline text-[22px] tracking-[1.5px] text-tab uppercase transition-[color,text-shadow,transform] duration-200 hover:text-tab-hover hover:[text-shadow:0_0_10px_var(--accent-glow)] hover:-translate-y-0.5 after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:w-0 after:bg-tab-hover after:transition-[width] after:duration-250 hover:after:w-full">Train</NavLink>
            <NavLink to="/test" className="relative no-underline text-[22px] tracking-[1.5px] text-tab uppercase transition-[color,text-shadow,transform] duration-200 hover:text-tab-hover hover:[text-shadow:0_0_10px_var(--accent-glow)] hover:-translate-y-0.5 after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:w-0 after:bg-tab-hover after:transition-[width] after:duration-250 hover:after:w-full">Test</NavLink>
            <NavLink to="/stats" className="relative no-underline text-[22px] tracking-[1.5px] text-tab uppercase transition-[color,text-shadow,transform] duration-200 hover:text-tab-hover hover:[text-shadow:0_0_10px_var(--accent-glow)] hover:-translate-y-0.5 after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:w-0 after:bg-tab-hover after:transition-[width] after:duration-250 hover:after:w-full">Stats</NavLink>
            <NavLink to="/profile" className="relative no-underline text-[22px] tracking-[1.5px] text-tab uppercase transition-[color,text-shadow,transform] duration-200 hover:text-tab-hover hover:[text-shadow:0_0_10px_var(--accent-glow)] hover:-translate-y-0.5 after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:w-0 after:bg-tab-hover after:transition-[width] after:duration-250 hover:after:w-full">Profile</NavLink>
        </nav>
    )

}