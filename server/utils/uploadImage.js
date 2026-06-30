export const uploadToImgBB = async (fileBuffer, fileName) => {
  const formData = new FormData();
  const blob = new Blob([fileBuffer]);
  formData.append('image', blob, fileName);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_KEY}`,
    { method: 'POST', body: formData }
  );

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || 'Image upload failed');
  }

  return data.data.url;
};
