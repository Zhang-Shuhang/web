import JSZip from "jszip";
import { formatTimeToStr } from "./data";

export const downloadImage = (imgsrc, name) => { //下载图片地址和图片名
    var image = new Image();
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

        var a = document.createElement("a"); // 生成一个a元素
        var event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
    };
    image.src = imgsrc;
}

export const downloadImageBatch = async (imageSrcs, name) => {
  const urlToBase64 = async (url) => {
    const img = new Image();
    img.src = url + "?v=" + Math.random();
    img.setAttribute("crossOrigin", "Anonymous");
    return await new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas
          .getContext("2d")
          .drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL());
      };
    });
  };

  const folderName = `${name} ${formatTimeToStr(new Date(), "yyyy-MM-dd hh:mm:ss")}`;
  const zip = new JSZip();
  const img = zip.folder(`${folderName}`);
  for (let i = 0; i < imageSrcs.length; i++) {
    const base64Str = await urlToBase64(imageSrcs[i]);
    img.file(`${i + 1}.${imageSrcs[i].split(".").pop()}`, base64Str.substring(22), { base64: true });
  }
  zip
    .generateAsync({
      type: "blob",
    })
    .then(function(content) {
      const aLink = document.createElement("a");
      aLink.download = `${folderName}.zip`;
      aLink.style.display = "none";
      aLink.href = URL.createObjectURL(content);
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink);
    });
};
