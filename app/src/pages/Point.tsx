import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';
import Modal from 'react-modal';
import { Chart } from "react-google-charts";

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

interface IModalText {
  cost: number,
  variableCost: number,
  fixedCost: number,
  margin: number,
  breakevenPoint: number
}

export default function Home() {
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  const [modalIsOpen,setIsOpen] = useState(false);
  const [modalDetailsIsOpen,setDetailsIsOpen] = useState(false);
  const [modalText, setModalText] = useState<IModalText>({
    cost: 0,
    variableCost: 0,
    fixedCost: 0,
    margin: 0,
    breakevenPoint: 0
  });


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

  function closeModalDetails() {
    setDetailsIsOpen(false);
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

  async function openModalDetails(
    cost: number,
    variableCost: number,
    fixedCost: number,
    margin: number,
    breakevenPoint: number
  ) {
    setModalText({
      cost,
      variableCost,
      fixedCost,
      margin,
      breakevenPoint
    });

    setDetailsIsOpen(true);
  }

  function handleLogout() {
    localStorage.clear();
    history.push('/');
  }

  return(
    <div className="profile-container">
      <Modal
        isOpen={modalDetailsIsOpen}
        onRequestClose={closeModalDetails}
        className="modal"
        contentLabel="Detalhes"
      >
        <div className="model-text">
          <strong>Preço de Venda: </strong>
          <span>{
            Intl.NumberFormat(
              'pt-BR', 
              { style: 'currency', currency: 'BRL'}
            ).format(Number(modalText.cost))
          }</span>
        </div>
        <div className="model-text">
          <strong>Custo Variável: </strong>
          <span>{
            Intl.NumberFormat(
              'pt-BR', 
              { style: 'currency', currency: 'BRL'}
            ).format(Number(modalText.variableCost))
          }</span>
        </div>
        <div className="model-text">
          <strong>Custo Fixo: </strong>
          <span>{
            Intl.NumberFormat(
              'pt-BR', 
              { style: 'currency', currency: 'BRL'}
            ).format(Number(modalText.fixedCost))
          }</span>
        </div>
        <div className="model-text">
          <strong>Margem: </strong>
          <span>{
            Intl.NumberFormat(
              'pt-BR', 
              { style: 'currency', currency: 'BRL'}
            ).format(Number(modalText.margin))
          }</span>
        </div>
          <div className="model-text">
            <strong>Ponto de Equilíbrio: </strong>
            <span>{Number(modalText.breakevenPoint).toFixed(2)}</span>
          </div>
          <Chart
            width={'600px'}
            height={'300px'}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={[
              [
                'x', 
                'Receita', 
                'Custo Total'
              ],
              [
                0, 
                0, 
                0
              ],
              [
                1000, 
                1000 * Number(modalText.cost), 
                1000 * Number(modalText.variableCost) + Number(modalText.fixedCost)
              ],
              [
                2000, 
                2000 * Number(modalText.cost), 
                2000 * Number(modalText.variableCost) + Number(modalText.fixedCost)
              ],
              [
                3000, 
                3000 * Number(modalText.cost), 
                3000 * Number(modalText.variableCost) + Number(modalText.fixedCost)
              ],
              [
                4000, 
                4000 * Number(modalText.cost), 
                4000 * Number(modalText.variableCost) + Number(modalText.fixedCost)
              ],
              [
                5000, 
                5000 * Number(modalText.cost), 
                5000 * Number(modalText.variableCost) + Number(modalText.fixedCost)
              ],
              [
                6000, 
                6000 * Number(modalText.cost), 
                6000 * Number(modalText.variableCost) + Number(modalText.fixedCost)
              ],
              [
                7000, 
                7000 * Number(modalText.cost), 
                7000 * Number(modalText.variableCost) + Number(modalText.fixedCost)
              ],
              [
                8000, 
                8000 * Number(modalText.cost), 
                8000 * Number(modalText.variableCost) + Number(modalText.fixedCost)
              ],
            ]}
            options={{
              hAxis: {
                title: 'Quantidade',
              },
              vAxis: {
                title: 'R$',
              },
              series: {
                1: { curveType: 'function' },
              },
            }}
            rootProps={{ 'data-testid': '2' }}
          />
          <button className="button-details" onClick={() => setDetailsIsOpen(false)}>Fecha</button>
      </Modal>
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
            Calcular Ponto de Equilíbrio
          </Link>
          <button type="submit" onClick={handleLogout}>
              <FiPower size={18} color="#e02041" />
          </button>
      </header>
      <h1>Cálculos Cadastrados</h1>
      <ul>
        {listPoint.map(item => (
          <li key={item.id}>
            <div className="point-items">
              <strong>Descrição: </strong>
              <span className="text-description">{item.description}</span>
            </div>
            <div className="point-items">
              <strong>Preço de Venda: </strong>
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
              <span>{item.breakevenPoint.toFixed(2)}</span>
            </div>
            <button 
              className="button-details" 
              onClick={() => openModalDetails(
                item.cost,
                item.variableCost,
                item.fixedCost,
                item.margin,
                item.breakevenPoint
              )}
            >
              Mais Detalhes 
            </button>
            <button className="button-delete" onClick={() => openModalRemove(item.id)}>
              <FiTrash2 size={32} color="#a8a8b3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}