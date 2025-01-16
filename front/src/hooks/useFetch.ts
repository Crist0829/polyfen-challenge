import { useState, useEffect } from "react";

interface Props {
  url: string;
  key?: string;
  method: "GET" | "POST" | "PUT";
  requestData?: FormData;
}

const useFetch = <T>({ method, requestData, url, key }: Props) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method,
        body: requestData,
      });

      const responseData = await response.json();

      console.log({responseData})

      if (key) {
        setData(responseData[key]);
      } else {
        setData(responseData);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    fetchData();
  };
  useEffect(() => {
    fetchData();
  }, [url, key]);

  return { data, loading, error, retry };
};

export default useFetch;
