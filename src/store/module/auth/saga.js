import { all, takeLatest, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '../../../service/api';
import history from '../../../service/history';

import { signFailure, signInSuccess } from './action';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;
    const res = yield call(api.post, 'sessions', {
      email,
      password,
    });

    //  se o post der sucesso, entao a resposta tera dados do login
    const { token, user } = res.data;

    if (!user.provider) {
      toast.error('usuário não prestador de serviço');
      return;
    }

    api.defaults.headers.Authorization = `Barear ${token}`;

    yield put(signInSuccess(token, user));

    history.push('/dashboard');
  } catch (err) {
    toast.error('Falha na autenticação. Verifique os dados informados');
    yield put(signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const { name, email, password } = payload;

    yield call(api.post, 'users', {
      name,
      email,
      password,
      provider: true,
    });
    history.push('/');
  } catch (err) {
    toast.error('Falha ao tentar cadastrar. Verifique os dados informados');
    yield put(signFailure());
  }
}

export function setToken({ payload }) {
  //  se payload vazio, usuario esta acessando pela primeira vez
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export function signOut() {
  history.push('/');
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
  takeLatest('@auth/SIGN_OUT', signOut),
]);
