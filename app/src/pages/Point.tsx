import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';
import Modal from 'react-modal';

import api from '../services/api';

import '../styles/point.css';

interface IListPoint {
  id: number,
  description: string,
  cost: number,
  variableCost: number,
  fixedCost: number,
  margin: number,
  breakevenPoint: number,
  id_user: string
}

if (typeof(window) !== 'undefined') {
  Modal.setAppElement('body')
}

export default function Home() {
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  const [modalIsOpen,setIsOpen] = useState(false);

  const [listPoint, setListPoint] = useState<IListPoint[]>([]);
  const [idPoint, setIdPoint] = useState<number>();

  const history = useHistory();

  useEffect( () => {
    api.get('auth', {
      headers: {
        Authorization: userId
      }
    }).catch(() => {
      history.push('/');
    })
  }, [userId] );

  useEffect( () => {
    api.get(`point/${userId}`).then(response => {
      setListPoint(response.data);
    });
  }, [userId]);

  function closeModal(){
    setIsOpen(false);
  }

  function openModalRemove(id: number) {
    setIdPoint(id)
    setIsOpen(true);
  }

  async function updateListPoint() {
    const response = await api.get(`point/${userId}`);
    setListPoint(response.data);
  }

  async function removeItem() {
    try {
      await api.delete(`point/${idPoint}`, {
        headers: {
          authorization: userId
        }
      });
      await updateListPoint()
      setIsOpen(false);
    } catch(err) {
      alert('Não foi possível exclui.');
      setIdPoint(0);
      setIsOpen(false);
    }
  }

  function handleLogout() {
    localStorage.clear();
    history.push('/');
  }

  return(
    <div className="profile-container">
      <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="modal-remove"
          contentLabel="Example Modal"
        >
          <div className="model-save">
            <span>Deseja Excluí Cálculo?</span>
            <div className="model-save-button">
              <button onClick={closeModal}>NÃO</button>
              <button onClick={removeItem}>SIM</button>
            </div>
          </div>
        </Modal>
      <header>
          <div className="logo-main">Break Even Point</div>
          <span>Bem vindo(a), {userName}</span>

          <Link to="/new" className="button">
            Novo Ponto de Equilíbrio
          </Link>
          <button type="submit" onClick={handleLogout}>
              <FiPower size={18} color="#e02041" />
          </button>
      </header>
      <h1>Ponto de Equilíbrio Cadastrados</h1>
      <ul>
        {listPoint.map(item => (
          <li key={item.id}>
            <div className="point-items">
              <strong>Descrição: </strong>
              <span className="text-description">{item.description}</span>
            </div>
            <div className="point-items">
              <strong>Preço: </strong>
              <span>{
                Intl.NumberFormat(
                  'pt-BR', 
                  { style: 'currency', currency: 'BRL'}
                ).format(item.cost)
              }</span>
            </div>
            <div className="point-items">
              <strong>Custo Variável: </strong>
              <span>{
                Intl.NumberFormat(
                  'pt-BR', 
                  { style: 'currency', currency: 'BRL'}
                ).format(item.variableCost)
              }</span>
            </div>
            <div className="point-items">
              <strong>Custo Fixo: </strong>
              <span>{
                Intl.NumberFormat(
                  'pt-BR', 
                  { style: 'currency', currency: 'BRL'}
                ).format(item.fixedCost)
              }</span>
            </div>
            <div className="point-items">
              <strong>Margem: </strong>
              <span>{
                Intl.NumberFormat(
                  'pt-BR', 
                  { style: 'currency', currency: 'BRL'}
                ).format(item.margin)
              }</span>
            </div>
            <div className="point-items">
              <strong>Ponto de Equilíbrio: </strong>
              <span>{item.breakevenPoint}</span>
            </div>
            <button type="submit" onClick={() => openModalRemove(item.id)}>
              <FiTrash2 size={32} color="#a8a8b3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}