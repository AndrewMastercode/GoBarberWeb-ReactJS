import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';

import { signUpRequest } from '../../store/module/auth/action';
import logo from '../../assets/logo.svg';

const schema = Yup.object().shape({
  name: Yup.string().required('insira seu nome'),
  email: Yup.string()
    .email('Insira um email válido')
    .required('Insira um e-mail'),
  password: Yup.string()
    .min(6, 'A senha deve possuir no mínimo 6 caracteres')
    .required('Insira uma senha'),
});

export default function SignUp() {
  const dispatch = useDispatch();

  function handleSubmit({ name, email, password }) {
    dispatch(signUpRequest(name, email, password));
  }

  return (
    <>
      <img src={logo} alt="GoBarber" />

      <Form schema={schema} onSubmit={handleSubmit}>
        <Input name="name" placeholder="Digite aqui seu nome" />
        <Input name="email" type="email" placeholder="Digite aqui seu e-mail" />
        <Input
          name="password"
          type="password"
          placeholder="Digite aqui sua senha"
        />
        <button type="submit">Cadastrar</button>
        <Link to="/">Já tenho uma conta</Link>
      </Form>
    </>
  );
}
