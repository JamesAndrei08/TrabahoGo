// backend/cloudinary.js
export const uploadToCloudinary = async (imageUri) => {
    const data = new FormData();
    data.append("file", {
      uri: imageUri,
      name: "profile.jpg",
      type: "image/jpeg",
    });
    data.append("upload_preset", "ml_default");
  
    const res = await fetch("https://api.cloudinary.com/v1_1/ddepyodi7/image/upload", {
      method: "POST",
      body: data,
    });
  
    const json = await res.json();
    return json.secure_url;
  };
  