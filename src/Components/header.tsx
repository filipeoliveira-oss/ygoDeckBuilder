import { Search, X } from "lucide-react";
import { card } from "../helpers/interfaces";
import { useRef, useState } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import axios from 'axios'
import { Button } from "./ui/button";
import { Action } from "./ui/headerAction";
import logo from '/logo.png'

interface headerInterface{
    mainDeckCards: card[],
    setSearch:Function,
    cards: card[],
    extraDeckCards:card[],
    setCards:Function,
    setCurrentCards:Function,
    setMainDeckCards:Function,
    setExtraDeckCards:Function,
    search:string
}

export default function Header({mainDeckCards,setSearch,cards,extraDeckCards,setCards,setCurrentCards,setExtraDeckCards,setMainDeckCards,search}:headerInterface){
	const collectionRef  = useRef<any>(null)
	const deckRef  = useRef<any>(null)
	const [help, setHelp] = useState(false)
	const [AIModal, setAIModal] = useState(false)
	const [needToImportCollection, setNeedToImportCollection] = useState(false)
	const [clearDeckModal, setClearDeck] = useState(false)
    const [collection, setCollection] = useState<card[]>([])
    
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
                setCollection(arr.sort((a:card, b:card) => parseInt(String(a.cardId)) - parseInt(String(b.cardId))))
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

    function importDeck(){
		if(deckRef){
			deckRef?.current?.click()
		}
		if(collectionRef){
			collectionRef.current.value = ''
		}
	}

    function importCollection(){
		if(collectionRef){
			collectionRef?.current?.click()
		}
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

    function generateAIText(){
		
		let baseText = 'I need you to imagine that your a yu gi oh pro player and you know all the best tactics to win every single oponent and I need you to think clearly to answer my questions.\nI will send a list containing their name and quantity of the card I have available for this deck. I need you to give the best possible deck within 40 to 50 cards and give a reasonable reason for your choices, What are the mechanics and how would you play.\n\n'
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
    
    function clearDeck(){
		setMainDeckCards([])
		setExtraDeckCards([])
		setSearch('')
        setCards(collection)
        setCurrentCards(collection)
	}

    return(
        <>
            <div className="flex justify-between px-4 w-full h-12 items-center">

                <div>
                    <img src={logo} alt="Logo" className="w-12 h-full"/>
                </div>

                <div className="flex px-2 items-center justify-center gap-4">
                    <Action onClick={() => importDeck()}>Importar Deck</Action>
                    <Action onClick={() => importCollection()}>Importar Coleção</Action>
                    <Action onClick={downloadDeck} variant={mainDeckCards.length > 0 || extraDeckCards.length > 0 ? 'primary' : 'disabled'}>Exportar Deck</Action>
                    <Action onClick={() => setClearDeck(true)} variant={mainDeckCards.length > 0 || extraDeckCards.length > 0 ? 'primary' : 'disabled'}>Limpar Deck</Action>
                    <Action onClick={() => setHelp(true)}>Ajuda</Action>
                    <Action onClick={() => setAIModal(true)}>Otimizar</Action>

                    <input type="file" name="file" accept=".csv" className='hidden' onChange={readCsv} id='teste' ref={collectionRef}/>
                    <input type="file" name="file" accept=".ydk" className='hidden' onChange={readDeck} id='teste' ref={deckRef}/>
                </div>

                <form className=' flex gap-4 items-center justify-center h-[80%] p-2 border-zinc-500 border-2 focus-within:border-violet-500 focus-within:border-2 focus-within:ring-violet-500' onSubmit={searchCard}>
                    <input type="text" className='text-zinc-300' placeholder='Buscar Carta' onChange={(e) => setSearch(e.target.value)}/>
                    <button type='submit'>
                        <Search onClick={searchCard} />
                    </button>
                </form>

            </div>
            

            <Dialog.Root open={AIModal}>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay " />
                <Dialog.Content className="DialogContent bg-zinc-700 text-white">
                <Dialog.Title className="DialogTitle text-white">Gerador de Deck</Dialog.Title>

                <Dialog.Description>
                    <span>Para ter auxílio da IA para montar seu deck, um texto será enviado para o seu clipboard e você será redirecionado para o <strong>CHAT-GPT</strong>, lá você só precisa colar o texto e enviar</span>
                </Dialog.Description>



                <div className='w-full h-fit min-h-8 flex justify-end gap-4'>
                    <Button aria-label="Close" onClick={() => {handleAI(), setAIModal(false)}} className='h-12 flex text-center bg-violet-500 justify-center items-center p-1'>
                        Estou pronto
                    </Button>
                </div>

                <Dialog.Close asChild>
                    <button className="IconButton" aria-label="Close" onClick={() => setAIModal(false)}>
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

                    <Button aria-label="Close" onClick={() => {setHelp(false)}} className='h-12 flex text-center bg-violet-500 justify-center items-center p-1'>
                        Entendi
                    </Button>
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
                        <Button aria-label="Close" onClick={() => {importCollection()}} className='h-12 flex text-center bg-violet-500 justify-center items-center p-1'>
                            Importar Coleção
                        </Button>
                    </div>

                    <Dialog.Close asChild>
                        <button className="IconButton" aria-label="Close" onClick={() => {alert('Boa tentativa, importa a porra da coleção!!!')}}>
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
                        <Button aria-label="Close" onClick={() => {setClearDeck(false)}} className='h-12 flex text-center justify-center items-center p-1'>
                            Cancelar
                        </Button>

                        <Button aria-label="Close" onClick={() => {clearDeck(); setClearDeck(false)}} className='h-12 flex text-center bg-red-500 justify-center items-center p-1 hover:bg-red-500'>
                            Limpar deck
                        </Button>
                    </div>

                    <Dialog.Close asChild>
                        <button className="IconButton" aria-label="Close" onClick={() => {setClearDeck(false)}}>
                        <X/>
                        </button>
                    </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
			</Dialog.Root>
        </>
    )
}