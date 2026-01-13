

import AppLogo from "../AppLogo";
import { Button } from "../ui/button";

function PublicNavbar() {
  const isUserLoggedIn = true; // Replace with actual authentication logic

  return (
    <nav className={`w-full flex ${isUserLoggedIn ? "justify-end" : "justify-between"} h-max items-center py-2 pr-4 sticky top-0 z-10 bg-background`}>
      {!isUserLoggedIn &&
        <div className="flex w-max gap-3 px-4 items-center justify-between">
          <AppLogo />
          <Button variant="ghost" className="rounded-4xl mt-2" size="xl">
            Explore
          </Button>
        </div>}
      <div className="flex gap-4 items-center text-sm font-bold capitalize">
        <div className="flex text-lg font-medium gap-6 p-4 text-[#2b48d4]">
          <a href="#" className="hover:underline" target="_blank">About</a>
          <a href="#" className="hover:underline" target="_blank">Businesses</a>
          <a href="#" className="hover:underline" target="_blank">Create</a>
          <a href="#" className="hover:underline" target="_blank">News</a>
        </div>
        <Button variant="destructive" size="xl">Log in</Button>
        <Button variant="secondary" className="bg-button-foreground" size="xl">Sign up</Button>
      </div>
    </nav>
  );
}

export default PublicNavbar;