'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Switch, Tooltip, Popconfirm, Select, message } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Search } = Input;
const { Option } = Select;

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        const postList = Array.isArray(data) ? data : data.posts || [];
        setPosts(postList);
      } catch (err) {
        message.error('Lỗi khi tải bài viết');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Xoá bài viết
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        message.success('Đã xoá bài viết');
        setPosts(posts.filter((post) => post.id !== id));
      } else {
        message.error('Xoá thất bại');
      }
    } catch (err) {
      console.error(err);
      message.error('Có lỗi xảy ra');
    }
  };

  // Cột của bảng
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug) => <span style={{ color: '#1890ff' }}>{slug}</span>,
    },
    {
      title: 'Status',
      key: 'status',
      render: () => <Switch defaultChecked />,
      align: 'center',
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem">
            <Link href={`/posts/${record.slug}`}>
              <Button icon={<EyeOutlined />} />
            </Link>
          </Tooltip>
          <Tooltip title="Sửa">
            <Link href={`/dashboard/posts/edit/${record.id}`}>
              <Button icon={<EditOutlined />} type="primary" />
              </Link>
          </Tooltip>
          <Tooltip title="Xoá">
            <Popconfirm
              title="Bạn có chắc chắn muốn xoá bài viết này không?"
              onConfirm={() => handleDelete(record.id)}
              okText="Xoá"
              cancelText="Huỷ"
            >
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 30 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 'bold' }}>📋 Blog Management</h2>
        <Button type="primary" icon={<PlusOutlined />}>
          Add New Blog
        </Button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <Search placeholder="Search by name or slug" style={{ width: 300 }} />
        <Select placeholder="-- All --" style={{ width: 150 }}>
          <Option value="all">All</Option>
          <Option value="published">Published</Option>
          <Option value="draft">Draft</Option>
        </Select>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={posts}
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default PostListPage;
