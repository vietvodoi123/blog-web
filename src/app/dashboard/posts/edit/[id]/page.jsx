"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Select from 'react-select';
import Editor from '@/components/Editor';

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

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState(null);
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchPost = async () => {
  //     try {
  //       const res = await fetch(`/api/posts/${id}`);
  //       const data = await res.json();
        
  //       setTitle(data.title);
  //       setSlug(data.slug);
  //       setContent(data.desc);
  //       setSeoTitle(data.seoTitle || '');
  //       setSeoDesc(data.seoDesc || '');
  //       setSeoKeywords(data.seoKeywords || '');
  //       setCategory(categoryOptions.find(opt => opt.value === data.catSlug) || null);
  //       setTags((data.tags || []).map(tag => tagOptions.find(opt => opt.value === tag)).filter(Boolean));
  //     } catch (error) {
  //       console.error('Failed to fetch post:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPost();
  // }, [id]);
  useEffect(() => {
  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/posts/${id}`);
      const data = await res.json();
      console.log("Fetched post:", data); // Xem kết quả

      setTitle(data.title);
      setSlug(data.slug);
      setCategory(data.catSlug ? { value: data.catSlug, label: data.catSlug } : null);
      setTags(data.tags?.map(tag => ({ value: tag, label: tag })) || []);
      setContent(data.desc);
      setSeoTitle(data.seoTitle);
      setSeoDesc(data.seoDesc);
      setSeoKeywords(data.seoKeywords);
    } catch (err) {
      console.error("Error loading post:", err);
    }
  };

  if (id) fetchPost();
}, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      title,
      slug,
      desc: content,
      catSlug: category?.value || '',
      tags: tags.map(tag => tag.value),
      seoTitle,
      seoDesc,
      seoKeywords,
    };

    const res = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });

    if (res.ok) {
      alert('✅ Cập nhật bài viết thành công');
      router.push('/dashboard/posts');
    } else {
      alert('❌ Cập nhật thất bại');
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>✏️ Chỉnh sửa bài viết</h2>
      <form onSubmit={handleSubmit}>
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
          <button type="submit" style={{ padding: '10px 20px', marginRight: '10px' }}>💾 Lưu</button>
          <button type="button" style={{ padding: '10px 20px' }} onClick={() => router.back()}>❌ Huỷ</button>
        </div>
      </form>
    </div>
  );
}
