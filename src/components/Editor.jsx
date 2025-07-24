"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Editor = ({ value, onChange }) => {
  const [editorValue, setEditorValue] = useState(value || "");

  // Đồng bộ từ props ra nội bộ (khi load lần đầu)
  useEffect(() => {
    if (value !== editorValue) {
      setEditorValue(value);
    }
  }, [value]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: async function () {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.click();

            input.onchange = async () => {
              const file = input.files[0];
              const imageUrl = await uploadToCloudinary(file);
              if (imageUrl) {
                const range = this.quill.getSelection();
                this.quill.insertEmbed(range.index, "image", imageUrl);
              }
            };
          },
        },
      },
    }),
    []
  );

  const handleChange = (val) => {
    setEditorValue(val);
    onChange(val); // gửi ra ngoài
  };

  return (
    <ReactQuill
      theme="snow"
      value={editorValue}
      onChange={handleChange}
      modules={modules}
      placeholder="Nhập nội dung bài viết..."
      style={{ height: "300px", marginBottom: "30px" }}
    />
  );
};

export default Editor;
