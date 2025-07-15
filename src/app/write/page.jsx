"use client";
import styles from "./writePage.module.css";
import "react-quill/dist/quill.bubble.css";
import { useState } from 'react';
import Editor from '@/components/Editor';
import Select from 'react-select';

const WritePage = () => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState(null);
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ title, slug, category, tags, content, seoTitle, seoDesc, seoKeywords, image });
    // Bạn có thể gọi API POST ở đây
    const postData = {
      title,
      slug,
      desc: content, // nội dung HTML từ WYSIWYG
      img: "",
      catSlug: category?.value || '',
      tags: tags.map(tag => tag.value),
      seoTitle,
      seoDesc,
      seoKeywords,
      userEmail: "user@example.com" // hoặc từ context đăng nhập
    };

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        const data = await res.json();
        alert('📝 Bài viết đã được lưu thành công!');
        console.log(data);
      } else {
        throw new Error('Lỗi khi gửi bài viết');
      }
    } catch (err) {
      alert('❌ Gửi thất bại');
      console.error(err);
    }
  };

  const categoryOptions = [
    { value: 'tech', label: 'Tech' },
    { value: 'life', label: 'Life' },
    { value: 'travel', label: 'Travel' },
  ];

  const tagOptions = [
    { value: 'nextjs', label: 'Next.js' },
    { value: 'react', label: 'React' },
    { value: 'tutorial', label: 'Tutorial' },
  ];

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>➕ Add New Blog</h2>
      <form onSubmit={handleSubmit}>
        {/* Upload ảnh */}
        <div>
          <label>Image:</label><br />
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        <div style={{ marginTop: '15px' }}>
          <label>Title *</label><br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ marginTop: '15px' }}>
          <label>Slug</label><br />
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="ex: how-to-use-nextjs"
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ marginTop: '15px' }}>
          <label>Categories</label>
          <Select
            options={categoryOptions}
            value={category}
            onChange={setCategory}
            placeholder="Select category"
          />
        </div>

        <div style={{ marginTop: '15px' }}>
          <label>Tags</label>
          <Select
            options={tagOptions}
            value={tags}
            onChange={setTags}
            isMulti
            placeholder="Select tags"
          />
        </div>

        <div style={{ marginTop: '20px' }}>
          <label>Description</label>
          <Editor value={content} onChange={setContent} />
        </div>

        <div style={{ marginTop: '15px' }}>
          <label>SEO Title</label><br />
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ marginTop: '15px' }}>
          <label>SEO Description</label><br />
          <textarea
            value={seoDesc}
            onChange={(e) => setSeoDesc(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ marginTop: '15px' }}>
          <label>SEO Keywords</label><br />
          <input
            type="text"
            value={seoKeywords}
            onChange={(e) => setSeoKeywords(e.target.value)}
            placeholder="nextjs, blog, react"
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ marginTop: '20px' }}>
          <button type="submit" style={{ padding: '10px 20px', marginRight: '10px' }}>✅ Save</button>
          <button type="button" style={{ padding: '10px 20px' }} onClick={() => window.history.back()}>❌ Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default WritePage;
