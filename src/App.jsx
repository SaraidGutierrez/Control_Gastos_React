import { useState, useEffect } from 'react'
import Header from './componentes/Header'
import Modal from './componentes/Modal'
import ListadoGastos from './componentes/ListadoGastos'
import IconoNuevoGasto from './img/nuevo-gasto.svg'
import { generarID } from './helpers'
import Filtro from './componentes/Filtro'


function App() {
  const [presupuesto, setPresupuesto]= useState(
    Number(localStorage.getItem('presupuesto')) ?? 0
  )
  const[isValidPresupuesto, setIsValidPresupuesto]= useState(false)
  const [modal, setModal]= useState(false)
  const [animarModal, setAnimarModal]= useState(false)
  const [gastos,setGastos]=useState(
    localStorage.getItem('gastos') ? JSON.parse(localStorage.getItem('gastos')) : []
  )
  const [gastoEditar, setGastoEditar]= useState({})
  const [filtro, setFiltro] = useState('')
  const [gastosFiltrados, setGastosFiltrados] = useState([])

  useEffect(()=>{
    if(Object.keys(gastoEditar).length >0){
      setModal(true)
      

    setTimeout(()=>{
      setAnimarModal(true)}, 500);
    }
  }, [gastoEditar])

  useEffect(()=>{
    localStorage.setItem('presupuesto', presupuesto ?? 0)
  }, [presupuesto])

  useEffect(() =>{
    if(filtro){
      // Filtrando gastos 
      const gastosFiltrados = gastos.filter (gasto => gasto.categoria === filtro);
      setGastosFiltrados(gastosFiltrados)
    }
  }, [filtro]);

  useEffect( ()=>{
    localStorage.setItem('gastos', JSON.stringify(gastos)) ?? []
  }, [gastos]

  )

  useEffect( ()=>{
      const presupuestoLS= Number(localStorage.getItem('presupuesto')) ?? 0;
      if(presupuesto>0){
        setIsValidPresupuesto(true)
      }
  }, [])

  const handleNuevoGasto = () =>{
    setModal(true)
    setGastoEditar({})

    setTimeout(()=>{
      setAnimarModal(true)}, 500);
    
  }

  const guardarGasto= gasto =>{
      if(gasto.id){
        const gastosActualizados = gastos.map(gastoState => gastoState.id === gasto.id ? gasto : gastoState)
          setGastos(gastosActualizados)
      }else{
        gasto.id= generarID();
        gasto.fecha= Date.now();
        setGastos([...gastos,gasto])
        setGastoEditar({})
      }

    
    setAnimarModal(false)
    setTimeout(()=>{
        setModal(false)}, 500)
  }

  const eliminarGasto= id =>{
    const gastosActualizados =gastos.filter(gasto=> gasto.id !== id)
    setGastos(gastosActualizados)
  }
  
  return (
   <div className={modal ?'fijar' : ""}>
      <Header
        gastos={gastos}
        presupuesto={presupuesto}
        setPresupuesto={setPresupuesto}
        isValidPresupuesto={isValidPresupuesto}
        setIsValidPresupuesto={setIsValidPresupuesto}
        setGastos={setGastos}
      />  
      {isValidPresupuesto && (
        <>
          <main>
          <Filtro
            filtro={filtro}
            setFiltro={setFiltro}
          />
          <ListadoGastos
          gastos={gastos}
          setGastoEditar={setGastoEditar}
          eliminarGasto={eliminarGasto}
          gastosFiltrados={gastosFiltrados}
          setGastosFiltrados={setGastosFiltrados}
          filtro={filtro}
          />
          </main>
          <div className='nuevo-gasto'>
            <img src={IconoNuevoGasto} 
                alt="icono nuevo gasto" 
                onClick={handleNuevoGasto}/>
          </div>
        </>
      )} 
      {modal && <Modal
               setModal={setModal}
               animarModal={animarModal}
               setAnimarModal={setAnimarModal}
               guardarGasto={guardarGasto}
               gastoEditar={gastoEditar}
               setGastoEditar={setGastoEditar}
               /> }
   </div>
  )
}

export default App
