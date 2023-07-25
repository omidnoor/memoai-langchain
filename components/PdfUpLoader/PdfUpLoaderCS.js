import { useState } from "react";

const PdfUpLoaderCS = () => {
  const [error, setError] = useState("");
  const handleSubmitPDF = async () => {
    try {
      console.log(`sending`);
      console.log(`using pdfUpLoader`);

      // A GET request is sent to the backend
      const response = await fetch(`/api/langChain/pdfUpLoader`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // The response from the backend is parsed as JSON
      const searchRes = await response.json();
      console.log(searchRes);
      setError(""); // Clear any existing error messages
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };
  return <button onClick={handleSubmitPDF}>Upload</button>;
};
export default PdfUpLoaderCS;
