import axios from 'axios';
import BodyForm from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import fs from 'fs';
import { load as cheerioLoad } from 'cheerio';
const cheerio = { load: cheerioLoad };

async function GraphOrg(Path) {
  if (!fs.existsSync(Path)) throw new Error("File not Found");
  const form = new BodyForm();
  form.append("file", fs.createReadStream(Path));
  const data = await axios({
    url: "https://graph.org/upload",
    method: "POST",
    headers: { ...form.getHeaders() },
    data: form,
  });
  return "https://graph.org" + data.data[0].src;
}

async function CatboxUpload(filePath) {
  if (!fs.existsSync(filePath)) throw new Error("File not Found");
  const form = new BodyForm();
  form.append("reqtype", "fileupload");
  form.append("userhash", "");
  form.append("fileToUpload", fs.createReadStream(filePath));
  const { data } = await axios({
    url: "https://catbox.moe/user/api.php",
    method: "POST",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
      ...form.getHeaders(),
    },
    data: form,
  });
  return data; // returns the URL string directly e.g. https://files.catbox.moe/xxxxx.mp4
}

async function UploadFileUgu(input) {
  const form = new BodyForm();
  form.append("files[]", fs.createReadStream(input));
  const data = await axios({
    url: "https://uguu.se/upload.php",
    method: "POST",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
      ...form.getHeaders(),
    },
    data: form,
  });
  return data.data.files[0];
}

async function webp2mp4File(path) {
  const form = new BodyForm();
  form.append("new-image-url", "");
  form.append("new-image", fs.createReadStream(path));
  
  const { data: firstData } = await axios({
    method: "post",
    url: "https://ezgif.com/webp-to-mp4",
    data: form,
    headers: { "Content-Type": `multipart/form-data; boundary=${form._boundary}` },
  });

  const $ = cheerio.load(firstData);
  const file = $('input[name="file"]').attr("value");
  
  if (!file) return { status: false, message: "Upload failed", result: null };

  const bodyFormThen = new BodyForm();
  bodyFormThen.append("file", file);
  bodyFormThen.append("convert", "Convert WebP to MP4!");

  const { data: secondData } = await axios({
    method: "post",
    url: "https://ezgif.com/webp-to-mp4/" + file,
    data: bodyFormThen,
    headers: {
      "Content-Type": `multipart/form-data; boundary=${bodyFormThen._boundary}`,
    },
  });

  const $2 = cheerio.load(secondData);
  const resultRaw = $2("div#output > p.outfile > video > source").attr("src");
  
  if (!resultRaw) return { status: false, message: "Conversion failed", result: null };

  const result = resultRaw.startsWith("http") ? resultRaw : "https:" + resultRaw;
  return { status: true, message: "Created By MRHRTZ", result };
}

export { GraphOrg, CatboxUpload, UploadFileUgu, webp2mp4File };
export default { GraphOrg, CatboxUpload, UploadFileUgu, webp2mp4File }; 