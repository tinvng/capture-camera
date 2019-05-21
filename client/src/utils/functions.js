import axios from 'axios';
import { addr } from './configs';

export const uploadHandler = (file, fileName) => {
  const formData = new FormData();

  formData.append(
    "uploadFile",
    file,
    fileName,
  );

  return axios.post(addr, formData);
};