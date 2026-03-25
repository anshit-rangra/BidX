import { uploadPic as realUploadPic, deletePic as realDeletePic } from './imagekit.service.ts';

let currentUploadPic = realUploadPic;
let currentDeletePic = realDeletePic;

export function setImagekitMocks({ uploadPic, deletePic }: { uploadPic?: any; deletePic?: any }) {
  if (uploadPic) currentUploadPic = uploadPic;
  if (deletePic) currentDeletePic = deletePic;
}

export { currentUploadPic as uploadPic, currentDeletePic as deletePic };
