
import { useState } from 'react'
import './App.css'
import axios from 'axios'
import Papa from 'papaparse';
import CardComponent from './components/cardComponent';

function App() {

	const [cards, setCards] = useState<Array<{id:string, img:string}>>([])
	const BASE_API_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php?id='
	const [showMainDeck, setShowMainDeck] = useState(true)
	const [showExtraDeck, setShowExtraDeck] = useState(true)
	const [showSideDeck, setShowSideDeck] = useState(true)
	
	const readCsv = async (event:any) =>{
		await Papa.parse(event.target.files[0], {
			header: true,
			skipEmptyLines: true,
			complete: function (results:any) {
				let arr:Array<{id:string, img:string}> = []
				results.data.map((each:any)=>{
					for(let i = 0; i < each.cardq; i++){
						arr.push({
							id: each.cardid,
							img: `https://images.ygoprodeck.com/images/cards_small/${each.cardid}.jpg`
						})
					}
				})
				setCards(arr)
			},
		});
	}
	
	const MainDeck = () =>{
		return(
			<div className={`flex bg-blue-500 h-${showMainDeck ? '[50%]': 'fit'} flex-col gap-2`} >
				<div className='flex w-full h-fit items-center justify-between px-4 cursor-pointer' onClick={()=>{setShowMainDeck(!showMainDeck)}}>
					<h1 className='font-medium text-sm tracking-tight leading-normal '>Main Deck</h1>
					<span className={showMainDeck ? 'rotate-90' : 'rotate-0'} >&gt;</span>
				</div>
				<div className={`h-full w-full bg-red-500 grid grid-cols-cards overflow-auto ${showMainDeck ? '':'hidden'}`}>
					{cards.map((card:any)=>{
						return(
							<CardComponent card={card}/>
						)
					})}
				</div>
			</div>
		)
	}

	const ExtraDeck = () => {
		return(
			<div className={`flex bg-blue-500 h-${showExtraDeck ? '[50%]': 'fit'} flex-col gap-2`}>
				<div className='flex w-full h-fit items-center justify-between px-4 cursor-pointer' onClick={()=>{setShowExtraDeck(!showExtraDeck)}}>
					<h1 className='font-medium text-sm tracking-tight leading-normal '>Extra Deck</h1>
					<span className={showExtraDeck ? 'rotate-90' : 'rotate-0'} >&gt;</span>
				</div>
				<div className={`h-full w-full bg-red-500 grid grid-cols-cards overflow-auto ${showExtraDeck ? '':'hidden'}`}>
					{cards.map((card:any)=>{
						return(
							<CardComponent card={card}/>
						)
					})}
				</div>
			</div>
		)
	}

	const SideDeck = () =>{
		return(
			<div className={`flex bg-blue-500 h-${showSideDeck ? '[50%]': 'fit'} flex-col gap-2`}>
				<div className='flex w-full h-fit items-center justify-between px-4 cursor-pointer' onClick={()=>{setShowSideDeck(!showSideDeck)}}>
					<h1 className='font-medium text-sm tracking-tight leading-normal '>Side Deck</h1>
					<span className={showSideDeck ? 'rotate-90' : 'rotate-0'} >&gt;</span>
				</div>
				<div className={`h-full w-full bg-red-500 grid grid-cols-cards overflow-auto ${showSideDeck ? '':'hidden'}`}>
					{cards.map((card:any)=>{
						return(
							<CardComponent card={card}/>
						)
					})}
				</div>
			</div>
		)
	}
 
	return (
		<div className='flex flex-col h-screen w-screen items-center px-4 py-4 overflow-hidden '>
			<div className='flex gap-4 items-center justify-center'>
				<h1 className='font-medium text-sm tracking-tight leading-normal'>Yu Gi Oh Deck Builder</h1>
				<input type="file" name="file" accept=".csv" className=' unset bg-violet-500' onChange={readCsv}/>
			</div>

			<div className='flex h-full w-full py-4 gap-4'>
				<div className='flex flex-1 flex-col gap-1'>
					<MainDeck/>
					<ExtraDeck/>
					<SideDeck/>
				</div>

				<div className='h-full w-[1px] bg-zinc-600'/>

				<div className='flex-1 flex-col overflow-x-auto grid grid-cols-cards pb-4'>
					{cards.map((card:any)=>{
						return(
							<CardComponent card={card}/>
						)
					})}
					
				</div>
			</div>
		</div>
	)
}

export default App
