import { Outlet } from "react-router-dom";
import Host from "../pages/Host";

export default function HostLayout() {
    return (
        <>
            <Host />

            <main>
                <Outlet />
            </main>
        </>
    )
}