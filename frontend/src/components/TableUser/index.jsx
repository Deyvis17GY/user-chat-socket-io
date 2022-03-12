import { Button, Card, Modal, Popconfirm, Space, Table } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React, { useEffect, useState } from 'react';
import { getUsers, getUserById } from '@src/services/api.js';
import { baseHttps } from '../../utils/api';
import { ChatUser } from '../ChatUser';
import styles from './styles.module.css';

export const TableUSer = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'Address',
      dataIndex: 'content'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) =>
        dataUser.length && (
          <Space size="middle">
            <Button type="primary" onClick={() => handleEdit(record._id)}>
              Edit
            </Button>
            <Popconfirm
              title="Are you sure delete this user?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No">
              <Button type="danger"> Delete</Button>
            </Popconfirm>
            <Button onClick={() => handleProfile(record._id)}>Profile</Button>
            <Button type="dashed" onClick={() => showChatContainer(record._id)}>
              Chat
            </Button>
          </Space>
        )
    }
  ];

  const [dataUser, setDataUser] = useState([]);
  const [userId, setUserId] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const [isModal, setIsModal] = useState(false);
  const [values, setValues] = useState({
    name: '',
    email: '',
    content: ''
  });

  const [onlyUser, setOnlyUser] = useState({
    _id: '',
    name: '',
    email: '',
    content: '',
    img: ''
  });

  const [showChat, setShowChat] = useState(false);

  const [file, setFile] = useState(null);

  const [showProfile, setShowProfile] = useState(false);
  const [dataUserChat, setDataUserChat] = useState([]);

  const onChangeFile = (event) => {
    setFile(event.target.files[0]);
  };

  const onInputChange = ({ target }) => {
    setValues({
      ...values,
      [target.name]: target.value
    });
  };

  const handleDelete = async (id) => {
    await baseHttps.delete(`/api/${id}`);
    getDataUser();
  };

  const handleEdit = async (id) => {
    setIsEdit(true);
    const { data } = await getUserById(id);
    setValues({
      name: data.name,
      email: data.email,
      content: data.content
    });

    setUserId(id);
    setIsModal(true);
  };

  const handleModalCreate = () => {
    setIsModal(!isModal);
  };

  const handleProfile = async (id) => {
    const { data } = await getUserById(id);
    setOnlyUser({ ...data });
    setShowProfile(true);
  };

  const getDataUser = async () => {
    try {
      getUsers().then(([getListUsers]) => {
        setDataUser(getListUsers);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const showChatContainer = async (id) => {
    const { data } = await getUserById(id);
    setDataUserChat({ ...data });
    setShowChat(true);
  };

  const onRegisterUpdate = async (ev) => {
    ev.preventDefault();
    try {
      if (!isEdit) {
        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('content', values.content);
        formData.append('image', file);

        const response = await baseHttps.post(`/api/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 200) {
          resetForm();
        }
      } else {
        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('content', values.content);
        formData.append('image', file);

        const upload = await baseHttps.put(`/api/${userId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (upload.status === 200) {
          resetForm();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    getDataUser();
    setValues({
      name: '',
      email: '',
      content: ''
    });
    setIsModal(false);
    setIsEdit(false);
  };

  useEffect(() => {
    getDataUser();
  }, []);

  return (
    <div className="mx-4">
      <Button className="my-4" onClick={handleModalCreate} type="primary">
        Add User
      </Button>

      <div className="col-md-12 row">
        <div className="col-md-8  mx-2">
          <Modal
            title={isEdit ? 'Edit User' : 'Create User'}
            visible={isModal}
            onOk={handleModalCreate}
            onCancel={handleModalCreate}>
            <form onSubmit={onRegisterUpdate}>
              <input
                type="text"
                className="form-control  my-3 rounded-0"
                placeholder="Write a name"
                name="name"
                value={values.name}
                onChange={onInputChange}
              />
              <input
                type="text"
                className="form-control  my-3 rounded-0"
                placeholder="Write a email"
                name="email"
                value={values.email}
                onChange={onInputChange}
              />
              <input
                type="text"
                className="form-control  my-3 rounded-0"
                placeholder="Write address"
                name="content"
                value={values.content}
                onChange={onInputChange}
              />
              <input
                type="file"
                className="form-control text-light rounded-0"
                onChange={onChangeFile}
                accept="image/*"
              />
              <div className="my-3">
                <button className="btn btn-success rounded-0 w-100">
                  {isEdit ? 'Edit' : 'Update'}
                </button>
              </div>
            </form>
          </Modal>
          <Table
            dataSource={dataUser}
            columns={columns}
            size="middle"
            pagination={{ pageSize: 5 }}
            className={styles.tableUser}
          />
        </div>

        <div className="col-md-3">
          <ChatUser showChat={showChat} userName={dataUserChat.name} />
        </div>
        <Modal
          visible={showProfile}
          footer={null}
          onCancel={() => setShowProfile(false)}
          onOk={() => setShowProfile(true)}
          width="300px">
          <Card
            hoverable
            style={{ width: 240 }}
            loading={!onlyUser.image}
            cover={<img alt="example" src={onlyUser.image} />}>
            <Meta title={onlyUser.name} description={onlyUser.content} />
          </Card>
        </Modal>
      </div>
    </div>
  );
};
