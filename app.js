const containerSelect = document.getElementById("container-select");
const containerDownload = document.getElementById("container-download");
const fileUploader = document.getElementById("upload");
const addImageFile = document.getElementById("add-image");
const download = document.getElementById("download");

const { jsPDF } =  window.jspdf;
let pdf = new jsPDF();

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const a4_72dpi = {width: 595, height: 842};
const a4_96dpi = {width: 794, height: 1123};

const quality = .6;
let filename = "document";
let multipleFiles = false;


const imageUpload = (e) => {
  containerSelect.classList.add("hide");
  containerDownload.classList.remove("hide");

  const file = e.target.files[0];
  setFileName(file);

  const reader = new FileReader();
  reader.onload = loadImage;
  reader.readAsDataURL(file);
}

const setFileName = (file) => {
  let delimiter = ".";
  if(multipleFiles)
    delimiter = "-";

  const index = file.name.lastIndexOf(delimiter);
  filename = file.name.slice(0, index);
}

const loadImage = (e) => {
  const image = new Image();
  image.onload = addImage;
  image.src = e.target.result;
}

const addImage = (e) => {
  addImageToCanvas(e);
  addImageToPdf();
}

const addImageToCanvas = (e) => {
  const {width, height} = e.target;
  const scaleFactor = resizeFactor(width);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = Math.floor(width * scaleFactor)
  canvas.height = Math.floor(height * scaleFactor)
  ctx.scale(scaleFactor, scaleFactor);
  ctx.drawImage(e.target, 0, 0);
}

const addImageToPdf = () => {
  const imgData = canvas.toDataURL("image/jpeg", quality);
  pdf.addImage(imgData, 'JPEG', 0, 0);
}

download.onclick = () => {
  pdf.save(`${filename}.pdf`);

  containerSelect.classList.remove("hide");
  containerDownload.classList.add("hide");
  multipleFiles = false;
}

addImageFile.onclick = () => {
  multipleFiles = true;
  pdf.addPage();
  upload.click();
}

const resizeFactor = (width) => {
  return a4_96dpi.width / width;
}

fileUploader.onchange = imageUpload;
