import React from 'react'
import styled from 'styled-components';
const VentanaEmergente = ({children, estado, cambiarEstado,titulo,mostrarTitulo}) => {
      return (
        <>
            {estado &&
                <Overlay>
                    <ContenedorModal>
                        {mostrarTitulo && 
                        <EncabezadoModal>
                            <h3>{titulo}</h3>
                        </EncabezadoModal>
                        }
                        <BotonCerrar onClick={cambiarEstado}>X</BotonCerrar>
                        {children}
                    </ContenedorModal>
                </Overlay> 
            }
        </>
    );
}

export default VentanaEmergente;
const Overlay = styled.div`
    width : 100vw;
    height : 100vh;
    position : fixed;
    top : 0;
    left : 0;
    background : rgba(0,0,0,.8);
    padding: 40px;

    display : flex;
    align-items: center;
    justify-content: center;
`;

const ContenedorModal = styled.div`
    width : 300px;
    min-height :100px;
    background : #fff;
    position: relative;
    border-radius: 5px;
    box-shadow: rgba(100,100,111,0.3) 0px 7px 29px 0px;
    padding: 20px;
`;

const EncabezadoModal = styled.div`
    display:flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #E8E8E8 ;
    h3 {
        font-weight: 500;
        font-size: 16px;
        color: #1766DC;
    }
`;

const BotonCerrar = styled.div`
    position: absolute;
    top: 20px;
    right: 20px;

    width: 30px;
    height: 30px;
    border: none;
    background: none;
    cursor: pointer;
    transition: .3s ease all;
    border-radius: 5px;
    color: #1766DC;
    text-align: center;

    &:hover {
        background: #02F2F2;
    }
`;