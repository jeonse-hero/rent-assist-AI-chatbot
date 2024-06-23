import { useState, ChangeEvent } from 'react';

const useFileInput = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files ? e.target.files[0] : null);
  };

  return {
    file,
    setFile,
    handleFileChange,
  };
};

export default useFileInput;
