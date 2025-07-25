"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Switch,
  Tooltip,
  Popconfirm,
  Select,
  message,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Search } = Input;
const { Option } = Select;

const pageSize = 20;

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleToggleFeatured = async (id, newValue) => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isFeatured: newValue }),
      });

      if (res.ok) {
        message.success("Đã cập nhật Featured");
        // Cập nhật local state nhanh
        setPosts((prev) =>
          prev.map((post) =>
            post.id === id ? { ...post, isFeatured: newValue } : post
          )
        );
      } else {
        message.error("Cập nhật thất bại");
      }
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi cập nhật");
    }
  };

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?page=${page}&perPage=${pageSize}`);
      const data = await res.json();

      setPosts(data.posts || []);
      setCounts(data.count || 0);
    } catch (err) {
      message.error("Lỗi khi tải bài viết");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        message.success("Đã xoá bài viết");
        fetchPosts(currentPage); // Reload lại trang hiện tại
      } else {
        message.error("Xoá thất bại");
      }
    } catch (err) {
      console.error(err);
      message.error("Có lỗi xảy ra");
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      render: (slug) => <span style={{ color: "#1890ff" }}>{slug}</span>,
    },
    {
      title: "Featured",
      key: "featured",
      dataIndex: "isFeatured",
      align: "center",
      render: (isFeatured, record) => (
        <Switch
          checked={isFeatured}
          onChange={() => handleToggleFeatured(record.id, !isFeatured)}
        />
      ),
    },

    {
      title: "Action",
      key: "action",
      align: "center",
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: "bold" }}>📋 Blog Management</h2>
        <Link href="/write" type="primary" icon={<PlusOutlined />}>
          Add New Blog
        </Link>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
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
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: counts,
          onChange: (page) => setCurrentPage(page),
        }}
      />
    </div>
  );
};

export default PostListPage;
