import React, { FormEvent, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Modal from 'react-modal';

import api from '../services/api';

import '../styles/newPoint.css';

import { FiArrowLeft } from 'react-icons/fi';

interface IModalText {
  cost: string,
  variableCost: string,
  fixedCost: string,
  margin: string,
  breakevenPoint: string
}

if (typeof(window) !== 'undefined') {
  Modal.setAppElement('body')
}

export default function NewPoint() {
  const userId = localStorage.getItem('userId');

  const [modalIsOpen,setIsOpen] = useState(false);
  const [modalText, setModalText] = useState<IModalText>({
    cost: '',
    variableCost: '',
    fixedCost: '',
    margin: '',
    breakevenPoint: ''
  });

  
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [variableCost, setVariableCost] = useState('');
  const [fixedCost, setFixedCost] = useState('');
  const [margin, setMargin] = useState('');
  const [breakevenPoint, setBreakevenPoint] = useState('');
  
  const history = useHistory();

  useEffect( () => {
    api.get('auth', {
      headers: {
        Authorization: userId,
      }
    }).catch(() => {
      history.push('/');
    })
  }, [userId] );

  function closeModal(){
    setIsOpen(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if(cost != undefined && variableCost != undefined && fixedCost != undefined) {
      const marginNumber = '' + (Number(cost) - Number(variableCost));
      const breakevenPointNumber = '' + (Number(fixedCost) / Number(marginNumber));
      setMargin(marginNumber);
      setBreakevenPoint(breakevenPointNumber);
      
      setIsOpen(true);
      
      setModalText({
        cost,
        variableCost,
        fixedCost,
        margin: marginNumber,
        breakevenPoint: breakevenPointNumber
      });
    }
  }

  async function saveCalculation() {
    try {
      await api.post('point', {
        id_user: userId,
        description,
        cost,
        variableCost,
        fixedCost,
        margin,
        breakevenPoint
      });

      history.push('/home');
    } catch(err) {
      console.log(err)
    }
  }

  return(
    <div className="new-incident-container">
      <div className="content">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="modal"
          contentLabel="Example Modal"
        >
          <div className="model-text">
            <strong>Preço: </strong>
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
            <span>{modalText.breakevenPoint}</span>
          </div>
          <div className="model-save">
            <span>Deseja Salvar Cálculo?</span>
            <div className="model-save-button">
              <button onClick={closeModal}>NÃO</button>
              <button onClick={saveCalculation}>SIM</button>
            </div>
          </div>
        </Modal>
        <section>
          <span className="logo">Break Even Point</span>
          <h1>Calcular Ponto de Equilíbrio</h1>
          <p>Informe os valores detalhadamente para calcular o ponto de equilíbrio.</p>
          <Link to="/home" className="back-link">
            <FiArrowLeft size={16} color="#e02041" />
            Volta para home
          </Link>
        </section>
        <form onSubmit={handleSubmit}>
            <textarea 
                placeholder="Faça uma breve descrição, assim quando procurar em seu histórico ficará fácil de identificar"
                value={description}
                onChange={ e => setDescription(e.target.value)}
            />
            <input 
                placeholder="Preço"
                value={cost}
                onChange={ e => setCost(e.target.value)}
                type="number"
            />
            <input 
                placeholder="Custo Variável"
                value={variableCost}
                onChange={ e => setVariableCost(e.target.value)}
                type="number"
            />
            <input 
                placeholder="Custo Fixo"
                value={fixedCost}
                onChange={ e => setFixedCost(e.target.value)}
                type="number"
            />
            <button type="submit" className="button">Calcular</button>
        </form>
      </div>
    </div>
  );
}