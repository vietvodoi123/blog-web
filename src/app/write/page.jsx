"use client";
import styles from "./writePage.module.css";
import { useState } from "react";
import Editor from "@/components/Editor";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

import { useSession } from "next-auth/react";

const generateSlug = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD") // chuyển ký tự có dấu thành ký tự gốc + dấu
    .replace(/[\u0300-\u036f]/g, "") // xóa dấu
    .replace(/[^a-z0-9\s-]/g, "") // chỉ giữ chữ thường, số và khoảng trắng
    .trim()
    .replace(/\s+/g, "-"); // thay khoảng trắng bằng -
};

const WritePage = () => {
  console.log("Rendering WritePage");

  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Bạn có thể gọi API POST ở đây
    const postData = {
      title,
      slug,
      desc: content, // nội dung HTML từ WYSIWYG
      img: image,
      catSlugs: categories.map((c) => c.value), // danh sách category dạng array
      tags: tags.map((tag) => tag.value),
      seoTitle,
      seoDesc,
      seoKeywords,
      userEmail: session?.user?.email || "vietvodoi1232@gmail.com", // Lấy email từ session
    };

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        const data = await res.json();
        alert("📝 Bài viết đã được lưu thành công!");
        console.log(data);
      } else {
        const errData = await res.json(); // 👈 lấy dữ liệu lỗi từ server
        console.error("❌ Lỗi gửi bài:", errData.message, errData.error);
        alert("❌ Gửi thất bại: " + errData.message);
      }
    } catch (err) {
      alert("❌ Gửi thất bại");
      console.error(err);
    }
  };

  const tagOptions = [
    { value: "nextjs", label: "Next.js" },
    { value: "react", label: "React" },
    { value: "tutorial", label: "Tutorial" },
  ];

  return (
    <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2>➕ Add New Blog</h2>
      <form onSubmit={handleSubmit}>
        {/* Upload ảnh */}
        <div>
          <label>Image:</label>
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                const imageUrl = await uploadToCloudinary(file);
                if (imageUrl) {
                  setImage(imageUrl); // 🔁 Lưu URL chứ không phải file gốc
                } else {
                  alert("❌ Tải ảnh lên thất bại!");
                }
              }
            }}
          />
        </div>

        <div style={{ marginTop: "15px" }}>
          <label>Title *</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSlug(generateSlug(e.target.value));
            }}
            required
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginTop: "15px" }}>
          <label>Slug</label>
          <br />
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="ex: how-to-use-nextjs"
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginTop: "15px" }}>
          <label>Categories</label>
          <CreatableSelect
            isMulti
            value={categories}
            onChange={setCategories}
            placeholder="Nhập hoặc chọn danh mục"
          />
        </div>

        <div style={{ marginTop: "15px" }}>
          <label>Tags</label>
          <CreatableSelect
            isMulti
            options={tagOptions}
            value={tags}
            onChange={setTags}
            placeholder="Select or type tags"
          />
        </div>

        <div style={{ marginTop: "20px" }}>
          <label>Description</label>
          <Editor value={content} onChange={setContent} />
        </div>

        <div style={{ marginTop: "15px" }}>
          <label>SEO Title</label>
          <br />
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginTop: "15px" }}>
          <label>SEO Description</label>
          <br />
          <textarea
            value={seoDesc}
            onChange={(e) => setSeoDesc(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginTop: "15px" }}>
          <label>SEO Keywords</label>
          <br />
          <input
            type="text"
            value={seoKeywords}
            onChange={(e) => setSeoKeywords(e.target.value)}
            placeholder="nextjs, blog, react"
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginTop: "20px" }}>
          <button
            type="submit"
            style={{ padding: "10px 20px", marginRight: "10px" }}
          >
            ✅ Save
          </button>
          <button
            type="button"
            style={{ padding: "10px 20px" }}
            onClick={() => window.history.back()}
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default WritePage;
