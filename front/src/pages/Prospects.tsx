import Table from "@/components/prospects/Table";
import { BASE_URL_API } from "@/config";
import useFetch from "@/hooks/useFetch";
import PrincipalLayout from "@/layouts/PrincipalLayout";
import { Prospect } from "@/types";
import { Loader2, Send } from "lucide-react";
import { Link } from "wouter";

function Prospects() {
  const { data, loading, error } = useFetch<Prospect[]>({
    url: `${BASE_URL_API}/prospects`,
    method: "GET",
  });

  let content;

  /* If there is an error */
  if (!loading && error) {
    content = (
      <div className="flex items-center gap-2  justify-center flex-col text-pretty">
        <p className="text-xl text-center">
          Ocurrio un error al traer los Prospectos
        </p>
        <span>{error}</span>
      </div>
    );
  } else {
    content = loading ? (
      <div className="flex items-center gap-2 animate-pulsing justify-center">
        <p className="text-xl">Trayendo prospectos</p>
        <Loader2 className="animate-rotate-360 animate-iteration-count-infinite" />{" "}
      </div>
    ) : (
      <div className="flex w-full">
        {data?.length == 0 ? (
          <div className="flex justify-center flex-col items-center gap-10 w-full">
            <p className="text-xl text-center ">No se encontraron prospectos</p>
            <div >
              <Link to="/prospects/upload" className="flex gap-1 items-center">
                Subir archivo <Send width={12} />
              </Link>
            </div>
          </div>
        ) : (
          <Table prospects={data!} />
        )}
      </div>
    );
  }

  return (
    <PrincipalLayout>
      <h1 className="text-3xl mb-10 font-bold text-center">Prospectos</h1>
      {content}
    </PrincipalLayout>
  );
}

export default Prospects;
