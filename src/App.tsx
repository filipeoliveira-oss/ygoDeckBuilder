
import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [cardsRequest, setCardsRequest] = useState([])


  return (
    <div className='flex flex-col h-screen w-screen items-center px-4 py-4'>
		<div className='flex flex-col gap-4'>
			<h1 className='font-medium text-sm tracking-tight leading-normal'>Yu Gi Oh Deck Builder</h1>
			<input type="file" name="file"accept=".csv" className=' unset bg-violet-500'/>
		</div>

		<div className='flex h-full w-full py-4'>
			<div className='flex flex-1'>
				a
			</div>

			<div className='flex flex-1'>
				b
			</div>
		</div>
    </div>
  )
}

export default App
