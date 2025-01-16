import logo from "@/assets/logo.svg";
import Footer from "@/components/Footer";

import { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";

import { Link } from "wouter";

interface Props extends PropsWithChildren {}

function PrincipalLayout({ children }: Props) {
  return (
    <div className=" min-h-dvh w-11/12 mx-auto flex flex-col">




      <header className="flex flex-col gap-5 md:flex-row justify-between items-center py-5">
        <Link to="/prospects" className="text-white flex items-start relative">
          <img src={logo} alt="Ponyfel logo" width={200} />{" "}
          <small className="absolute -right-10 -top-1">Challenge Front</small>
        </Link>
        <nav className="flex gap-10 underline underline-offset-2">
          <Link to="/prospects/upload">Subir</Link>
          <Link to="/prospects">Prospectos</Link>
        </nav>
      </header>
      <main className="pb-5 flex-grow">{children}</main>
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default PrincipalLayout;
