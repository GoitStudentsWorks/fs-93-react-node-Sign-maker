import React, { useRef, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { HiOutlineEyeSlash } from 'react-icons/hi2';
import { HiOutlineEye } from 'react-icons/hi2';
import { HiOutlineArrowUpTray } from 'react-icons/hi2';
import { HiOutlineXMark } from 'react-icons/hi2';
import { ClipLoader } from 'react-spinners';
import css from './UserModal.module.css';
import { useAuth } from 'hooks/useAuth';
import {
  toastFulfilled,
  toastRejected,
} from 'components/servises/UserNotification';

export const UserModal = ({ onClose }) => {
  const { user, updateProfile, updateAvatar } = useAuth();
  const fileInputRef = useRef(null);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };
  const toggleRepeatPasswordVisibility = () => {
    setShowRepeatPassword(!showRepeatPassword);
  };

  const url = user.avatarURL;
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = event => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setImageUrl(imageUrl);
      setFile(selectedFile);
    }
  };
  const urlBase = file ? imageUrl : url;

  const SignupSchema = Yup.object().shape({
    name: Yup.string().max(32, 'Too Long!'),
    email: Yup.string().email('Invalid email').required('Required'),
    oldPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(64, 'Password must be no more than 64 characters'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(64, 'Password must be no more than 64 characters'),
    repeatPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(64, 'Password must be no more than 64 characters'),
  });

  const handleSubmit = async (values, { setErrors }) => {
    if (values.oldPassword && !values.password && !values.repeatPassword) {
      setErrors({
        password: 'Password must be at least 8 characters',
        repeatPassword: 'Password must be at least 8 characters',
      });
      return;
    }
    if (values.password !== values.repeatPassword) {
      setErrors({ repeatPassword: 'Passwords must match' });
      return;
    }
    if (!values.oldPassword && values.password && values.repeatPassword) {
      setErrors({
        oldPassword: 'Password must be at least 8 characters',
      });
      return;
    }
    if (!values.oldPassword && values.password && values.repeatPassword) {
      setErrors({
        oldPassword: 'Password must be at least 8 characters',
      });
      return;
    }
    if (values.oldPassword === values.password) {
      if (values.oldPassword !== '')
        setErrors({
          password: 'New password can not be the old one',
        });
    }

    let newProfile = {};
    if (user.name !== values.name) {
      newProfile = {
        ...newProfile,
        name: values.name,
      };
    }
    if (user.email !== values.email) {
      newProfile = {
        ...newProfile,
        email: values.email,
      };
    }
    if (user.gender !== values.gender) {
      newProfile = {
        ...newProfile,
        gender: values.gender,
      };
    }
    if (values.oldPassword !== values.password) {
      newProfile = {
        ...newProfile,
        password: values.oldPassword,
        newPassword: values.password,
      };
    }
    if (Object.keys(newProfile).length > 0) {
      try {
        setSubmitLoading(true);
        await updateProfile(newProfile);
        toastFulfilled('Your data has been successfully updated!');
        onClose();
      } catch (error) {
        toastRejected(error);
      } finally {
        setSubmitLoading(false);
      }
    }

    if (!file) {
      return;
    }

    try {
      setSubmitLoading(true);
      await updateAvatar(file);
      toastFulfilled('Your avatar has been successfully updated!');
      onClose();
    } catch (error) {
      toastRejected(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className={css.modalWrap}>
      <button className={css.closeBtn}
        type="submit"
        value="close button">
        <HiOutlineXMark className={css.closeIcon} onClick={onClose} />
      </button>
      <h1 className={css.title}>Setting</h1>
      <p className={css.photoText}>Your photo</p>
      <div className={css.wrapperAvatar}>
        {!user.avatarURL && !file ? (
          <div className={css.fakeImg}>
            <span>{user.email.charAt(0).toUpperCase()}</span>
          </div>
        ) : (
          <img src={urlBase} alt={user.name} className={css.img} />
        )}

        <button className={css.buttonAvatar} onClick={handleButtonClick}
          type="submit"
          value="Upload a photo button">
          <HiOutlineArrowUpTray /> Upload a photo
        </button>
      </div>
      <Formik
        initialValues={{
          name: user.name ? user.name : '',
          email: user.email,
          gender: user.gender,
          oldPassword: '',
          password: '',
          repeatPassword: '',
        }}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className={css.form}>
            <div>
              <label className={css.labelPhoto} htmlFor="photo"></label>
              <input
                ref={fileInputRef}
                id="photo"
                name="photo"
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
            <div className={css.wrapperDesktop}>
              <div className={css.genderNameEmailWrapper}>
                <div className={css.inputWrapperGender}>
                  <label className={css.labelGender}>
                    Your gender identity
                  </label>
                  <div className={css.genderWrapper}>
                    <label className={css.gender}>
                      <Field
                        className={css.radioBtn}
                        type="radio"
                        name="gender"
                        value="female"
                      />
                      Woman
                    </label>
                    <label className={css.gender}>
                      <Field
                        className={css.radioBtn}
                        type="radio"
                        name="gender"
                        value="male"
                      />
                      Man
                    </label>
                  </div>
                </div>
                <div className={css.inputWrapperName}>
                  <label className={css.labelName} htmlFor="name">
                    Your name
                  </label>
                  <div className={css.inputContainer}>
                    <Field
                      className={`${css.input} ${
                        errors.name && touched.name ? css.inputError : ''
                      }`}
                      id="name"
                      name="name"
                      placeholder="Name"
                      type="text"
                    />
                    {errors.name && touched.name ? (
                      <div className={css.errorNameMessage}>{errors.name}</div>
                    ) : null}
                  </div>
                </div>
                <div className={css.inputWrapperEmail}>
                  <label className={css.labelEmail} htmlFor="email">
                    E-mail
                  </label>
                  <div className={css.inputContainer}>
                    <Field
                      className={`${css.input} ${
                        errors.email && touched.email ? css.inputError : ''
                      }`}
                      id="email"
                      name="email"
                      placeholder="E-mail"
                      type="email"
                    />
                    {errors.email && touched.email ? (
                      <div className={css.errorNameMessage}>{errors.email}</div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className={css.passwordWrapper}>
                <label className={css.labelPassword}>Password</label>
                <div className={css.inputWrapper}>
                  <label className={css.password}>Outdated password:</label>
                  <div className={css.iconWrapper}>
                    <Field
                      className={`${css.input} ${
                        errors.oldPassword && touched.oldPassword
                          ? css.inputError
                          : ''
                      }`}
                      name="oldPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                    />
                    {errors.oldPassword && touched.oldPassword ? (
                      <div className={css.errorMessage}>
                        {errors.oldPassword}
                      </div>
                    ) : null}
                    <div className={css.passwordIconContainer}>
                      {showPassword ? (
                        <HiOutlineEye
                          className={css.passwordIcon}
                          onClick={togglePasswordVisibility}
                        />
                      ) : (
                        <HiOutlineEyeSlash
                          className={css.passwordIcon}
                          onClick={togglePasswordVisibility}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className={css.inputWrapper}>
                  <label className={css.password}>New password:</label>
                  <div className={css.iconWrapper}>
                    <Field
                      className={`${css.input} ${
                        errors.password && touched.password
                          ? css.inputError
                          : ''
                      }`}
                      name="password"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Password"
                    />
                    {errors.password && touched.password ? (
                      <div className={css.errorMessage}>{errors.password}</div>
                    ) : null}
                    <div className={css.passwordIconContainer}>
                      {showNewPassword ? (
                        <HiOutlineEye
                          className={css.newPasswordIcon}
                          onClick={toggleNewPasswordVisibility}
                        />
                      ) : (
                        <HiOutlineEyeSlash
                          className={css.newPasswordIcon}
                          onClick={toggleNewPasswordVisibility}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className={css.inputWrapper}>
                  <label className={css.password}>Repeat new password:</label>
                  <div className={css.iconWrapper}>
                    <Field
                      className={`${css.input} ${
                        errors.repeatPassword && touched.repeatPassword
                          ? css.inputError
                          : ''
                      }`}
                      name="repeatPassword"
                      type={showRepeatPassword ? 'text' : 'password'}
                      placeholder="Password"
                    />
                    {errors.repeatPassword && touched.repeatPassword ? (
                      <div className={css.errorMessage}>
                        {errors.repeatPassword}
                      </div>
                    ) : null}
                    <div className={css.passwordIconContainer}>
                      {showRepeatPassword ? (
                        <HiOutlineEye
                          className={css.newRepeatPasswordIcon}
                          onClick={toggleRepeatPasswordVisibility}
                        />
                      ) : (
                        <HiOutlineEyeSlash
                          className={css.newRepeatPasswordIcon}
                          onClick={toggleRepeatPasswordVisibility}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              disabled={submitLoading}
              className={css.button}
              type="submit"
            >
              {submitLoading ? (
                <ClipLoader
                  className={css.spinnerCss}
                  size={20}
                  color={'#ffffff'}
                  loading={submitLoading}
                />
              ) : (
                'Save'
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
