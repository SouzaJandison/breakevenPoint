import React, { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import api from '../services/api';

import '../styles/register.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [registerErr, setRegisterErr] = useState('');

  const history = useHistory();

  async function handleRegister(event: FormEvent) {
    event.preventDefault();
    setRegisterErr('');

    try {
      await api.post('/', {
        name,
        email,
        password
      });

      alert('Cadastro Realizado com sucesso!')

      history.push('/')
    } catch(err) {
      setRegisterErr('Erro no Cadastro tente novamente');
    }
  }

  return(
    <div className="register-container">
      <div className="content">
        <section>
          <span className="logo">Break Even Point</span>
          <h1>Cadastro</h1>
          <p>Faça seu cadastro, entre na plataforma e aproveite o melhor do Point.</p>
          <Link to="/" className="back-link">
            <FiArrowLeft size={16} color="#e02041" />
            Volta para o logon
          </Link>
        </section>
        <form onSubmit={handleRegister}>
          <span className="text-error">{registerErr}</span>
          <input 
            placeholder="Seu nome..." 
            value={name}
            onChange={ e => setName(e.target.value) }
          />
          <input type="email" 
            placeholder="E-mail" 
            value={email}
            onChange={ e => setEmail(e.target.value) }
          />
          <input 
            placeholder="Password" 
            value={password}
            onChange={ e => setPassword(e.target.value) }
          />
          <button type="submit" className="button">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}