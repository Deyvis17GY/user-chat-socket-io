import { Button, Card, Modal, Popconfirm, Space, Table } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React, { useEffect, useState } from 'react';
import { getUsers } from '@src/services/api.js';
import { baseHttps } from '@src/utils/api';
import { ChatUser } from '../ChatUser';
import styles from './styles.module.css';
import clsx from 'clsx';
import { pushNotify } from '../../utils/notify';

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
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);

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
    image: ''
  });

  const [showChat, setShowChat] = useState(false);

  const [file, setFile] = useState(null);

  const [showProfile, setShowProfile] = useState(false);
  const [dataUserChat, setDataUserChat] = useState([]);
  const [isEmptyValues, setIsEmptyValues] = useState(false);

  const getDataUsers = async () => {
    try {
      const data = await getUsers();
      if (!data) return;
      setDataUser(data.getListUsers);
    } catch (error) {
      console.error(error);
    }
  };

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
    try {
      await baseHttps.delete(`/api/${id}`);
      getDataUsers();
      pushNotify({ title: 'User deleted successfully', status: 'error' });
    } catch (error) {
      console.error(error);
      pushNotify({ title: 'Failed to delete', status: 'error' });
    }
  };

  const handleEdit = async (id) => {
    const userById = dataUser.find((user) => user._id === id);
    setValues({
      name: userById.name,
      email: userById.email,
      content: userById.content
    });
    setIsEdit(true);
    setUserId(id);
    setIsModal(true);
  };

  const handleModalCreate = () => {
    setIsModal(!isModal);
    setIsEdit(false);
    cleanValues();
  };

  const handleProfile = async (id) => {
    try {
      const userProfileById = dataUser.find((user) => user._id === id);
      setOnlyUser({ ...userProfileById });
      setShowProfile(true);
    } catch (error) {
      console.error(error);
    }
  };

  const showChatContainer = async (id) => {
    const userChatById = dataUser.find((item) => item._id === id);
    setDataUserChat({ ...userChatById });
    setShowChat(true);
  };

  const onRegisterUpdate = async (ev) => {
    ev.preventDefault();
    setIsLoadingUpload(true);
    try {
      const formData = new FormData();

      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('content', values.content);
      formData.append('image', file);

      if (!isEdit) {
        if (!values.name || !values.email || !values.content) {
          setIsEmptyValues(true);
          return;
        }

        const response = await baseHttps.post(`/api/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 200) {
          resetForm();
          pushNotify({ title: 'User created successfully' });
        }
      } else {
        const upload = await baseHttps.put(`/api/${userId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (upload.status === 200) {
          pushNotify({ title: 'successful edit' });
          resetForm();
        }
      }
    } catch (error) {
      console.error(error);
      pushNotify({ title: 'Upload Failed', status: 'error' });
    }
  };

  const resetForm = () => {
    getDataUsers();
    cleanValues();
    setIsModal(false);
    setIsEdit(false);
    setIsLoadingUpload(false);
    setFile(null);
  };

  const classBtnUpload = clsx(styles.btnUpload, {
    [styles.btnUploadActive]: file,
    [styles.btnUploadDisabled]: !file,
    [styles.isEmpty]: !isEdit
      ? !values.name || !values.email || !values.content || !file
      : !values.name || !values.email || !values.content,
    [styles.isLoadingButton]: isLoadingUpload
  });

  const classInputEmpty = clsx(styles.inputClass, {
    [styles.isEmptyInput]: isEmptyValues
  });

  const cleanValues = () => {
    return setValues({
      name: '',
      email: '',
      content: ''
    });
  };

  useEffect(() => {
    getDataUsers();
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
            <form onSubmit={onRegisterUpdate} className={styles.formCreateEdit}>
              <input
                type="text"
                className={classInputEmpty}
                placeholder="Write a name"
                name="name"
                value={values.name}
                onChange={onInputChange}
              />
              <input
                type="text"
                className={classInputEmpty}
                placeholder="Write a email"
                name="email"
                value={values.email}
                onChange={onInputChange}
              />
              <input
                type="text"
                className={classInputEmpty}
                placeholder="Write address"
                name="content"
                value={values.content}
                onChange={onInputChange}
              />
              <input
                type="file"
                className="form-control rounded-0"
                onChange={onChangeFile}
                accept="image/*"
              />
              <div className="my-3">
                <button className={classBtnUpload}>{isEdit ? 'Edit' : 'Create'}</button>
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
            cover={
              <img
                alt="example"
                src={onlyUser.image ? onlyUser.image : 'https://picsum.photos/200'}
                onError={(e) => (e.target.src = 'https://picsum.photos/200')}
              />
            }>
            <Meta title={onlyUser.name} description={onlyUser.content} />
          </Card>
        </Modal>
      </div>
    </div>
  );
};
