export const downloadImage = (_id, photo) => {
  const link = document.createElement("a");
  link.href = photo;
  link.download = `image-${_id}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
