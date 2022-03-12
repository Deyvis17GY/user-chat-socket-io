import React, { useState } from 'react';

export const FormUser = ({ addUsers, valor }) => {
  const [isEdit, setIsEdit] = useState(false);

  const [values, setValues] = useState({
    name: '',
    email: '',
    content: ''
  });

  const [file, setFile] = useState([]);

  const onInputChange = ({ target }) => {
    setValues({
      ...values,
      [target.name]: target.value
    });
  };

  const onChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onRegisterUpdate = async (ev) => {
    ev.preventDefault();
    try {
      const formData = new FormData();

      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('content', values.content);
      formData.append('image', file);
      addUsers(formData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={onRegisterUpdate}>
        <input
          type="text"
          className="form-control bg-dark text-light my-3 rounded-0"
          placeholder="Write a title for your photo"
          name="name"
          value={values.name}
          onChange={onInputChange}
        />
        <input
          type="text"
          className="form-control bg-dark text-light my-3 rounded-0"
          placeholder="Write a title for your photo"
          name="email"
          value={values.email}
          onChange={onInputChange}
        />
        <input
          type="text"
          className="form-control bg-dark text-light my-3 rounded-0"
          placeholder="Write a title for your photo"
          name="content"
          value={values.content}
          onChange={onInputChange}
        />
        <input
          type="file"
          className="form-control bg-dark text-light rounded-0"
          onChange={onChange}
          accept="image/*"
        />
        <div className="my-3">
          <button className="btn btn-success rounded-0 w-100">Upload</button>
        </div>
      </form>
    </div>
  );
};
