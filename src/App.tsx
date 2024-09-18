
import { useRef, useState } from 'react'
import './App.css'
import axios from 'axios'
import Papa from 'papaparse';
import * as Dialog from '@radix-ui/react-dialog';
import './modal.css'
import { Book, CircleHelp, Search, Shield, Star, Swords, X } from 'lucide-react';
import { saveAs } from 'file-saver';
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

interface card {
    cardId: string | number,
    img: string, 
	cardIndexOnArray:string,
	name:string
}

export interface CardRoot {
	id: number
	name: string
	typeline: string[]
	type: string
	humanReadableCardType: string
	frameType: string
	desc: string
	race: string
	atk: number
	def: number
	level: number
	attribute: string
	archetype: string
	ygoprodeck_url: string
	card_sets: CardSet[]
	card_images: CardImage[]
	card_prices: CardPrice[]
  }
  
  export interface CardSet {
	set_name: string
	set_code: string
	set_rarity: string
	set_rarity_code: string
	set_price: string
  }
  
  export interface CardImage {
	id: number
	image_url: string
	image_url_small: string
	image_url_cropped: string
  }
  
  export interface CardPrice {
	cardmarket_price: string
	tcgplayer_price: string
	ebay_price: string
	amazon_price: string
	coolstuffinc_price: string
  }
  

export default function App() {
	


	const [cards, setCards] = useState<card[]>([])
	const [showMainDeck, setShowMainDeck] = useState(true)
	const [showExtraDeck, setShowExtraDeck] = useState(true)
	const [mainDeckCards, setMainDeckCards] = useState<card[]>([])
	const [extraDeckCards, setExtraDeckCards] = useState<card[]>([])
	const [isOpen, setIsOpen] = useState(false)
	const [cardToInspect, setCardToInspect] = useState<CardRoot | null>(null)
	const [currentCards, setCurrentCards] = useState<card[]>(cards)
	const [search, setSearch] = useState('')
	const [clearDeckModal, setClearDeck] = useState(false)
	const [help, setHelp] = useState(false)
	const collectionRef  = useRef<any>(null)
	const deckRef  = useRef<any>(null)
	const [needToImportCollection, setNeedToImportCollection] = useState(false)
	const [AIModal, setAIModal] = useState(false)

	function removeDeckFromCollection(collection:card[], deck:card[]){
		deck.map(deckItem => {
		  // Find index of the first matching item in the collection
		  const index = collection.findIndex(
			collectionItem => String(collectionItem.cardId) === String(deckItem.cardId)
		  );
		  // If a match is found, remove it from the collection
		  if (index !== -1) {
			collection.splice(index, 1);
		  }
		});

		return collection
	  };

	const readCsv = async (event:any) =>{
		Papa.parse(event.target.files[0], {
			header: true,
			skipEmptyLines: true,
			complete: function (results:any) {
				let arr:card[] = []
				results.data.map((each:any)=>{
					for(let i = 0; i < each.cardq; i++){
						arr.push({
							cardId: each.cardid,
							img: `https://images.ygoprodeck.com/images/cards_small/${each.cardid}.jpg`,
							cardIndexOnArray: each.cardid +`_${each.card_edition}` +`_${i}`,
							name:each.cardname
						})
					}
				})

				if(needToImportCollection){
					let mainDeckSub = removeDeckFromCollection(arr, mainDeckCards)
					arr = mainDeckSub
				}
				
				setCards(arr.sort((a:card, b:card) => parseInt(String(a.cardId)) - parseInt(String(b.cardId))))
				setCurrentCards(arr.sort((a:card, b:card) => parseInt(String(a.cardId)) - parseInt(String(b.cardId))))
				setNeedToImportCollection(false)
			},
		});

	}
	
	const readDeck = async (event:any) =>{
		event.preventDefault()
		const reader = new FileReader()

		reader.onload = async (e) =>{
			const deck = e.target?.result
			let arrDeck = String(deck).split('\n').filter((str) =>{
				return /\S/.test(str);
			})
			let extraIndex = arrDeck.indexOf(" #extra ")
			let sideIndex = arrDeck.indexOf(" !side ")

			let mainDeck = arrDeck.slice(1, extraIndex)
			let extraDeck = arrDeck.slice(extraIndex + 1, sideIndex)

			let auxMainDeck:card[] = []
			let auxExtraDeck:card[] = []

			mainDeck.map(async (each:string) =>{
				let random = Math.random()
				
				await axios.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${each}`).then((res) =>{
					auxMainDeck.push({
						cardId: res.data.data[0].id,
						img: res.data.data[0].card_images[0].image_url_small, 
						cardIndexOnArray:res.data.data[0].id +`_common` +`_1` + random,
						name:res.data.data[0].name
					})
				})

			})

			extraDeck.map(async (each:string) =>{
				let random = Math.random()

				await axios.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${each}`).then((res) =>{
					auxExtraDeck.push({
						cardId: res.data.data[0].id,
						img: res.data.data[0].card_images[0].image_url_small, 
						cardIndexOnArray:res.data.data[0].id +`_common` +`_1` + random,
						name:res.data.data[0].name
					})
				})
			})

			setMainDeckCards(auxMainDeck.sort((a:card, b:card) => parseInt(String(a.cardId)) - parseInt(String(b.cardId))))
			setExtraDeckCards(auxExtraDeck.sort((a:card, b:card) => parseInt(String(a.cardId)) - parseInt(String(b.cardId))))
			setNeedToImportCollection(true)
		}

		reader.readAsText(event.target.files[0])
	}

	const MainDeck = () =>{
		return(
			<div className={`flex bg-blue-500 h-${showMainDeck && mainDeckCards.length > 0  ? 'full': 'fit'} flex-col gap-2`} >
				<div className='flex w-full h-fit items-center justify-between px-4 cursor-pointer' onClick={()=>{setShowMainDeck(!showMainDeck)}}>
					<div className='flex gap-4 items-center'>
						<h1 className='font-medium text-sm tracking-tight leading-normal '>Main Deck</h1>
						<span>{mainDeckCards.length}/40</span>
					</div>
					<span className={showMainDeck ? 'rotate-90' : 'rotate-0'} >&gt;</span>
				</div>
				<div className={`h-full bg-zinc-950 w-full  grid grid-cols-cards overflow-auto ${showMainDeck ? '':'hidden'}`}>
					{mainDeckCards.map((each:card) =>{
						return(
							<div key={each.cardIndexOnArray} className=" w-40 h-56 cursor-pointer" onClick={() => getCardInfo(each.cardId.toString())} onContextMenu={(e) => removeCardFromMainDeck(each, e)}>
								<img src={each.img} alt={each.cardId.toString()}/>
							</div>
						)
					})}
				</div>
			</div>
		)
	}

	const ExtraDeck = () => {
		return(
			<div className={`flex bg-blue-500 h-${showExtraDeck && extraDeckCards.length > 0 ? 'full': 'fit'} flex-col gap-2`}>
				<div className='flex w-full h-fit items-center justify-between px-4 cursor-pointer' onClick={()=>{setShowExtraDeck(!showExtraDeck)}}>
					<div className='flex gap-4 items-center'>
						<h1 className='font-medium text-sm tracking-tight leading-normal '>Extra Deck</h1>
						<span>{extraDeckCards.length}/20</span>
					</div>
					<span className={showExtraDeck ? 'rotate-90' : 'rotate-0'} >&gt;</span>
				</div>
				<div className={`h-full w-full bg-zinc-950 grid grid-cols-cards overflow-auto ${showExtraDeck ? '':'hidden'}`}>
					{extraDeckCards.map((each:card) =>{
						return(
							<div key={each.cardIndexOnArray} className="w-40 h-56 cursor-pointer" onClick={() => getCardInfo(each.cardId.toString())} onContextMenu={(e) => removeCardFromExtraDeck(each, e)}>
								<img src={each.img} alt={each.cardId.toString()}/>
							</div>
						)
					})}
				</div>
			</div>
		)
	}

	function sendCardToDeck(card:card, e:any){
		e.preventDefault()
		let extraDeckTypes = ["Fusion Monster","Link Monster","Pendulum Effect Fusion Monster","Synchro Monster","Synchro Pendulum Effect Monster","Synchro Tuner Monster","XYZ Monster","XYZ Pendulum Effect Monster"]
		
		axios.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${card.cardId}`).then((res) =>{
			let type = res.data.data[0].type
			if(extraDeckTypes.some((each:string) =>{return each === type})){
				setExtraDeckCards([...extraDeckCards,card])
				setCards(cards.filter((each:card) =>{
					return (each.cardIndexOnArray != card.cardIndexOnArray)
				}))
				setCurrentCards(cards.filter((each:card) =>{
					return (each.cardIndexOnArray != card.cardIndexOnArray) && each.name.toLowerCase().includes(search.toLowerCase())
				}))
			}
			else{
				setMainDeckCards([...mainDeckCards,card])
				setCards(cards.filter((each:card) =>{
					return (each.cardIndexOnArray != card.cardIndexOnArray)
				}))
				setCurrentCards(cards.filter((each:card) =>{
					return (each.cardIndexOnArray != card.cardIndexOnArray) && each.name.toLowerCase().includes(search.toLowerCase())
				}))
			}
		})
	}

	function removeCardFromMainDeck(card:card, e:any){
		e.preventDefault()
		let aux = cards.filter((each:card) =>{
			return each.name.toLowerCase().includes(search.toLowerCase())
		})

		setMainDeckCards(mainDeckCards.filter((each:card) =>{
			return (each.cardIndexOnArray != card.cardIndexOnArray)
		}))

		setCards([card, ...cards].sort((a:card, b:card) => parseInt(String(a.cardIndexOnArray)) - parseInt(String(b.cardIndexOnArray))))
		setCurrentCards([card, ...aux].sort((a:card, b:card) => parseInt(String(a.cardIndexOnArray)) - parseInt(String(b.cardIndexOnArray))))
		
	}

	function removeCardFromExtraDeck(card:card, e:any){
		e.preventDefault()
		let aux = cards.filter((each:card) =>{
			return each.name.toLowerCase().includes(search)
		})
		setExtraDeckCards(extraDeckCards.filter((each:card) =>{
			return (each.cardIndexOnArray != card.cardIndexOnArray)
		}))

		setCards([card, ...cards].sort((a:card, b:card) => parseInt(String(a.cardIndexOnArray)) - parseInt(String(b.cardIndexOnArray))))
		setCurrentCards([card, ...aux].sort((a:card, b:card) => parseInt(String(a.cardIndexOnArray)) - parseInt(String(b.cardIndexOnArray))))
	}

	function downloadDeck(){

		let deck = '#main \n'

		mainDeckCards.map((each:card) =>{
			deck = deck + each.cardId + '\n'
		})

		deck = deck + '\n #extra \n'

		extraDeckCards.map((each:card) =>{
			deck = deck + each.cardId + '\n'
		})

		deck = deck + '\n !side \n'


		var blob = new Blob([deck],{type:'text/plan: chartset=utf-8'})

		saveAs(blob, 'ygodeck.ydk', )
	}

	function getCardInfo(cardid:string){
		axios.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${cardid}`).then((res) =>{
			setCardToInspect(res.data.data[0])
			setIsOpen(true)
		})
	}

	function searchCard(e?:any){

		if(e){
			e.preventDefault();
		}

		let aux = cards.filter((each:card) =>{
			return each.name.toLowerCase().includes(search.toLowerCase())
		})

		setCurrentCards(aux)
	}

	function clearDeck(){
		setMainDeckCards([])
		setExtraDeckCards([])
		setCurrentCards(cards)
		setSearch('')
	}

	function importCollection(){
		if(collectionRef){
			collectionRef?.current?.click()
		}
	}

	function importDeck(){
		if(deckRef){
			deckRef?.current?.click()
		}
		if(collectionRef){
			collectionRef.current.value = ''
		}
	}


	function generateAIText(){
		
		let baseText = 'I need you to imagine that your a yu gi oh pro player and you know all the best tactics to win every single openent and I need you to think clearly to answer my questions.\nI will send a list containing their name and quantity of the card I have available for this deck. I need you to give the best possible deck within 40 to 50 cards and give a reasonable reason for your choices, What are the mechanics and how would you play.\n\n'
		let collectionMap = new Map()
		let collectionString = ''

		cards.map((each:card) =>{
			let currentqtd = collectionMap.get(each.name) || 0
			collectionMap.set(each.name, currentqtd + 1)
		})

		for(let [key,value] of collectionMap){
			collectionString+= `${key}: ${value}\n`
		}

		let FinalText = baseText + collectionString

		navigator.clipboard.writeText(FinalText)
		
	}

	function handleAI(){
		if(cards.length < 1){
			alert('Você precisa importar uma coleção primeiro!!!')
			return 
		}


		generateAIText()
		window.open('https://chat.openai.com', '_blank')
	}

	return (
		<div className='flex flex-col h-screen w-screen items-center px-4 py-4 overflow-hidden '>
			<Tooltip id="tooltip" place='bottom' />
			<div className='flex gap-4 items-center justify-between w-full px-4 relative'>
				<div className='flex gap-4'>
					<button onClick={downloadDeck} className={`p-2 bg-violet-500 ${mainDeckCards.length > 0 ? '' : 'opacity-0 pointer-events-none'}`}>Baixar deck</button>
					<button onClick={() => setClearDeck(true)} className={`p-2 bg-red-500 ${mainDeckCards.length > 0 ? '' : 'opacity-0 pointer-events-none'}`}>Limpar deck</button>
				</div>
				
				<div className='flex gap-4 items-center'>
					<h1 className='font-medium text-sm tracking-tight leading-normal'>Yu Gi Oh Deck Builder</h1>
					<button onClick={() => importDeck()} className='bg-orange-500 p-2 flex items-center justify-center'>Importar deck</button>
					<input type="file" name="file" accept=".ydk" className=' unset bg-orange-500 hidden' onChange={readDeck} id='teste' ref={deckRef}/>

					<button onClick={() => importCollection()} className='bg-violet-500 p-2 flex items-center justify-center'>Importar coleção</button>
					<input type="file" name="file" accept=".csv" className=' unset bg-violet-500 hidden' onChange={readCsv} id='teste' ref={collectionRef}/>
				</div>

				<form className='flex gap-4 items-center justify-center' onSubmit={searchCard}>
					<input type="text" className='input' placeholder='Buscar Carta' onChange={(e) => setSearch(e.target.value)}/>
					<button type='submit'>
						<Search onClick={searchCard}/>
					</button>
				</form>

				<div className='absolute top-0 left-80 cursor-pointer flex gap-4'>
					<CircleHelp onClick={() => setHelp(true)} data-tooltip-content='Ajuda' data-tooltip-id="tooltip"/>
					<Star size={24} onClick={() => setAIModal(true)} data-tooltip-content='Otimizar deck com IA' data-tooltip-id="tooltip"/>
				</div>
			</div>

			<div className='flex h-full w-full py-4 gap-4'>
				<div className='flex flex-1 flex-col gap-1'>
					<MainDeck/>
					<ExtraDeck/>
				</div>

				<div className='h-full w-[1px] bg-zinc-600'/>

				<div className='flex-1 flex-col overflow-x-auto grid grid-cols-cards pb-4'>
					{currentCards.map((card:card)=>{
						return(
							<div key={card.cardIndexOnArray} className=" w-40 h-56 cursor-pointer" onClick={()=> getCardInfo(card.cardId.toString())} onContextMenuCapture={(e)=> sendCardToDeck(card, e)}>
								<img src={card.img} alt={card.cardId.toString()}/>
							</div>
						)
					})}
				</div>
			</div>
			
			<Dialog.Root open={isOpen}>
			<Dialog.Portal>
				<Dialog.Overlay className="DialogOverlay " />
				<Dialog.Content className="DialogContent bg-zinc-700 text-white">
				<Dialog.Title className="DialogTitle text-white">{cardToInspect?.name}</Dialog.Title>

				<div className='flex w-full h-full gap-4'>
					<div className='w-[30%] h-full'>
						<img src={cardToInspect?.card_images[0]?.image_url}/>
					</div>
					
					<div className='h-full w-full  gap-4 flex flex-col text-white bg'>
						<div className='flex flex-1  h-fit gap-4'>
							<div className='w-full h-full flex flex-col bg-zinc-800 p-2 gap-2'>
								<span className='font-medium text-sm tracking-tight leading-normal '>Type</span>
								<div className='flex gap-2'>
									<Book/>
									<span>{cardToInspect?.type}</span>
								</div>
							</div>

							<div className='w-full h-full flex flex-col  bg-zinc-800 p-2 gap-2'>
								<span className='font-medium text-sm tracking-tight leading-normal '>Attribute</span>
								<div className='flex gap-2'>
									<img src={`https://images.ygoprodeck.com/images/cards/${cardToInspect?.attribute}.jpg`} alt={cardToInspect?.attribute}  className='w-6 h-6'/>
									<span>{cardToInspect?.attribute}</span>
								</div>
							</div>

							<div className='w-full h-full flex flex-col  bg-zinc-800 p-2 gap-2'>
								<span className='font-medium text-sm tracking-tight leading-normal '>typing</span>
								<div className='flex gap-2'>
									<img src={`https://images.ygoprodeck.com/images/cards/icons/race/${cardToInspect?.race}.png`} alt={cardToInspect?.race}  className='w-6 h-6'/>
									<span>{cardToInspect?.race}</span>
								</div>
							</div>
						</div>
						
						<div className='flex flex-1  h-fit gap-4'>
							<div className='w-full h-full flex flex-col  bg-zinc-800 p-2 gap-2'>
								<span className='font-medium text-sm tracking-tight leading-normal '>Level/Rank</span>
								<div className='flex gap-2'>
									<img src={`https://ygoprodeck.com/wp-content/uploads/2017/01/level.png`} alt={cardToInspect?.race}  className='w-6 h-6'/>
									<span>{cardToInspect?.level}</span>
								</div>
							</div>

							<div className='w-full h-full flex flex-col  bg-zinc-800 p-2 gap-2'>
								<span className='font-medium text-sm tracking-tight leading-normal '>ATK</span>
								<div className='flex gap-2'>
									<Swords/>
									<span>{cardToInspect?.atk}</span>
								</div>
							</div>

							<div className='w-full h-full flex flex-col  bg-zinc-800 p-2 gap-2'>
								<span className='font-medium text-sm tracking-tight leading-normal '>DEF</span>
								<div className='flex gap-2'>
									<Shield/>
									<span>{cardToInspect?.def}</span>
								</div>
							</div>
						</div>

						<div className='flex flex-col flex-1  bg-zinc-800 p-2 gap-2'>
							<span>Card Text</span>
							<span>{cardToInspect?.desc}</span>
						</div>
					</div>
				</div>


				<Dialog.Close asChild>
					<button className="IconButton" aria-label="Close" onClick={() => {setIsOpen(false), setCardToInspect(null)}}>
					<X/>
					</button>
				</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
			</Dialog.Root>


			<Dialog.Root open={clearDeckModal}>
			<Dialog.Portal>
				<Dialog.Overlay className="DialogOverlay " />
				<Dialog.Content className="DialogContent bg-zinc-700 text-white">
				<Dialog.Title className="DialogTitle text-white">Limpar o deck</Dialog.Title>

				<Dialog.Description>
					Você tem certeza que deseja limpar o deck?

				</Dialog.Description>

				<div className='w-full h-fit min-h-8 flex justify-end gap-4'>
					<button aria-label="Close" onClick={() => {setClearDeck(false)}} className='h-12 flex text-center bg-blue-500 justify-center items-center p-1'>
						Cancelar
					</button>

					<button aria-label="Close" onClick={() => {clearDeck(); setClearDeck(false)}} className='h-12 flex text-center bg-red-500 justify-center items-center p-1'>
						Limpar deck
					</button>
				</div>

				<Dialog.Close asChild>
					<button className="IconButton" aria-label="Close" onClick={() => {setClearDeck(false)}}>
					<X/>
					</button>
				</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
			</Dialog.Root>


			<Dialog.Root open={help}>
			<Dialog.Portal>
				<Dialog.Overlay className="DialogOverlay " />
				<Dialog.Content className="DialogContent bg-zinc-700 text-white">
				<Dialog.Title className="DialogTitle text-white">Como usar o app</Dialog.Title>

				<Dialog.Description>
				<div className='flex flex-col gap-4 mt-4'>
					<ol type="1" className='list-decimal ml-6'>
						<li>Acesse o site <a href="https://ygoprodeck.com/" className='underline text-violet-500' target='_blank'>ygoprodeck</a> e vá até sua coleção</li>
						<li>Clique em <strong>Tools</strong> e baixe como <strong>.csv</strong></li>
						<li>Ao baixar o arquivo selecione ele nesse site</li>
						<li>Ao importar o arquivo você verá uma lista com todas suas cartas</li>
						<li>Clique com o botão direito para adicioná-las ao Main Deck</li>
						<li>Clique com o botão esquerdo para ver os stats da carta</li>
						<li>Você pode filtrar pelo nome da carta</li>
						<li>Ao terminar de montar o Deck, selecione <strong>Baixar Deck</strong> e escolha o local de salvamento</li>
						<li>Abra o jogo e selecione <strong>Deck Manager</strong></li>
						<li>Clique em <strong>Import</strong> e em seguida <strong>Browse</strong></li>
						<li>Importe o arquivo baixado</li>
					</ol>  

					<span>Obs. 1: As cartas do Extra deck são adicionadas automaticamente</span>
					<span>Obs. 2: Não criei um Side Deck, mas ele pode ser adionado no jogo</span>
				</div>
				</Dialog.Description>

				<div className='w-full h-fit min-h-8 flex justify-end gap-4'>

					<button aria-label="Close" onClick={() => {setHelp(false)}} className='h-12 flex text-center bg-violet-500 justify-center items-center p-1'>
						Entendi
					</button>
				</div>

				<Dialog.Close asChild>
					<button className="IconButton" aria-label="Close" onClick={() => {setHelp(false)}}>
					<X/>
					</button>
				</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
			</Dialog.Root>


			<Dialog.Root open={needToImportCollection}>
			<Dialog.Portal>
				<Dialog.Overlay className="DialogOverlay " />
				<Dialog.Content className="DialogContent bg-zinc-700 text-white">
				<Dialog.Title className="DialogTitle text-white">Importar Coleção</Dialog.Title>

				<Dialog.Description>
					<span>Ao importar o seu deck você precisa importar/reimportar sua coleção</span>
				</Dialog.Description>



				<div className='w-full h-fit min-h-8 flex justify-end gap-4'>
					<button aria-label="Close" onClick={() => {importCollection()}} className='h-12 flex text-center bg-violet-500 justify-center items-center p-1'>
						Importar Coleção
					</button>
				</div>

				<Dialog.Close asChild>
					<button className="IconButton" aria-label="Close" onClick={() => {alert('Boa tentativa, importa a porra da coleção!!!')}}>
					<X/>
					</button>
				</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
			</Dialog.Root>

			<Dialog.Root open={AIModal}>
			<Dialog.Portal>
				<Dialog.Overlay className="DialogOverlay " />
				<Dialog.Content className="DialogContent bg-zinc-700 text-white">
				<Dialog.Title className="DialogTitle text-white">Gerador de Deck</Dialog.Title>

				<Dialog.Description>
					<span>Para ter auxílio da IA para montar seu deck, um texto será enviado para o seu clipboard e você será redirecionado para o <strong>CHAT-GPT</strong>, lá você só precisa colar o texto e enviar</span>
				</Dialog.Description>



				<div className='w-full h-fit min-h-8 flex justify-end gap-4'>
					<button aria-label="Close" onClick={() => {handleAI(), setAIModal(false)}} className='h-12 flex text-center bg-violet-500 justify-center items-center p-1'>
						Estou pronto
					</button>
				</div>

				<Dialog.Close asChild>
					<button className="IconButton" aria-label="Close" onClick={() => setAIModal(false)}>
					<X/>
					</button>
				</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
			</Dialog.Root>
		</div>
	)
}
