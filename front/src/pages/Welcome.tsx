import { BASE_URL_API } from "@/config";
import PrincipalLayout from "@/layouts/PrincipalLayout";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "wouter";

function Welcome() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [_, setLocation] = useLocation();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!file) {
      toast.error("No ha subido un archivo");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch(BASE_URL_API + "/prospects", {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error en el servidor");
        }

        return response.text();
      })
      .then(() => {
        toast.success("Archivo subido con éxito");
        setLocation("/prospects");
      })
      .catch((error) => {
        toast.error(error.message);
        setError(error.message);
      });
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { target } = e;
    if (target.files) {
      const [newFile] = target.files;
      if (!newFile.type.includes("csv")) {
        toast.error("Archivo inválido");
        setFile(null);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        return;
      }
      setFile(newFile);
    }
  }

  function handleCancel() {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <PrincipalLayout>
      <h1 className="text-3xl mb-10 font-bold text-center">Subir Archivo</h1>
      
      <main className="animate-fade-in" >
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-700 shadow-lg rounded-lg p-5 card flex flex-col gap-5 max-w-md mx-auto"
        >
          <label htmlFor="csv">
            <span className="block mb-2">CSV</span>
            <input ref={inputRef} onChange={handleChange} type="file" />
          </label>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="w-48 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!file}
              className="w-48 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Enviar
            </button>
          </div>
        </form>
        {error && <div>{error}</div>}
      </main>
    </PrincipalLayout>
  );
}

export default Welcome;
