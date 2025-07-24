// utils/uploadToCloudinary.js

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "blog_upload"); // 👉 preset bạn tạo trong cloudinary
  formData.append("cloud_name", "dlrpsbp23");

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dlrpsbp23/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
};
