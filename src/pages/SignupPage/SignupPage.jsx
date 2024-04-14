import React from 'react';
import AuthForm from 'components/AuthForm/AuthForm';
import css from '../../components/AuthForm/AuthForm.module.css';

const SignupPage = () => {
  return (
    <section className={`${css.AuthFormSection} container`}>
      <div>
        <AuthForm />
      </div>
    </section>
  );
};

export default SignupPage;
