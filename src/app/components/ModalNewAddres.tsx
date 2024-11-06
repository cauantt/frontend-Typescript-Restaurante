import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Cookies from "cookies-js";
import axios from 'axios';

const ModalNewAddress = ({ show, handleClose,setShow }) => {
  if (!show) return null;

  const [district, setDistrict] = useState("");
  const [street, setStreet] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [userId, setUserId] = useState("");

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  useEffect(() => {
    const savedUserId = Cookies.get("userId");
    setUserId(savedUserId);

    const fetchStates = async () => {
      try {
        const response = await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
        setStates(response.data);
      } catch (error) {
        console.error("Erro ao carregar estados:", error);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (state) {
        try {
          const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`);
          setCities(response.data);
        } catch (error) {
          console.error("Erro ao carregar cidades:", error);
        }
      }
    };

    fetchCities();
  }, [state]);

  const handleSelectState = (sigla, nome) => {
    setState(sigla);
    setShowStateDropdown(false);
  };

  const handleSelectCity = (nome) => {
    setCity(nome);
    setShowCityDropdown(false);
  };

  const newAddress = async () => {
    try {
      await api.post("address", {
        street,
        number,
        district,
        state,
        city,
        complement,
        user : userId
      });

      setShow(false)
    
      
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 z-50" onClick={handleClose}>
      <div className="bg-white rounded-lg shadow-lg relative p-14" onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-2 right-4 text-black text-xl font-bold">
          &times;
        </button>

        <div className="flex flex-col border border-gray-300 rounded-lg w-[500px]">
          <div className="p-5 w-full flex justify-center items-center">
            <div className="flex gap-2 justify-center items-center">
              <p>Cadastrar novo endereço</p>
            </div>
          </div>

          <form className="flex flex-col gap-5 p-5 pb-12 w-full justify-center" onSubmit={(e) => { e.preventDefault(); newAddress(); }}>
            <div className="flex gap-2">
              <input className="border-gray-400 border h-10 rounded-lg p-5 w-[400px]" type="text" placeholder="Bairro *" value={district} onChange={(e) => setDistrict(e.target.value)} />
              <input className="border-gray-400 border h-10 rounded-lg p-5 w-[150px]" type="text" placeholder="Número *" value={number} onChange={(e) => setNumber(e.target.value)} />
            </div>

            <div>
              <input className="border-gray-400 border h-10 rounded-lg p-5 w-full" type="text" placeholder="Rua *" value={street} onChange={(e) => setStreet(e.target.value)} />
            </div>

            <div className="flex gap-2">
              <div className="relative w-[250px]">
                <button type="button" className="border-gray-400 border h-10 rounded-lg p-2 w-full text-left" onClick={() => setShowStateDropdown(!showStateDropdown)}>
                  {state ? states.find((s) => s.sigla === state)?.nome : 'Selecione o estado'}
                </button>
                {showStateDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                    {states.map((s) => (
                      <div key={s.id} className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleSelectState(s.sigla, s.nome)}>
                        {s.nome}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative w-[250px]">
                <button type="button" className="border-gray-400 border h-10 rounded-lg p-2 w-full text-left" onClick={() => setShowCityDropdown(!showCityDropdown)} disabled={!state}>
                  {city || 'Selecione a cidade'}
                </button>
                {showCityDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                    {cities.map((c) => (
                      <div key={c.id} className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleSelectCity(c.nome)}>
                        {c.nome}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <input className="border-gray-400 border h-24 rounded-lg p-5 w-full" type="text" placeholder="Complemento (opcional)" value={complement} onChange={(e) => setComplement(e.target.value)} />
            </div>
            
            <button className="w-full bg-purple-500 h-12 mt-5 rounded-lg text-white hover:bg-purple-600" type="submit">
              Salvar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalNewAddress;
