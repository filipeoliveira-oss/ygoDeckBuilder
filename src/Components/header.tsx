import { Search, X } from "lucide-react";
import { card, csvCollection, decks } from "../helpers/interfaces";
import { useRef, useState } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import axios from 'axios'
import { Button } from "./ui/button";
import { Action } from "./ui/headerAction";
import logo from '/logo.png'
import { useRecoilState, useSetRecoilState } from "recoil";
import { cardsAtom, currentCardsAtom, extraDeckCardsAtom, mainDeckCardsAtom, searchAtom } from "../helpers/atoms";

export default function Header(){
    
    const [collection, setCollection] = useState<card[]>([])

    //ATOMS
    const [cards, setCards] = useRecoilState(cardsAtom)
    const [extraDeckCards, setExtraDeckCards] = useRecoilState(extraDeckCardsAtom)
    const [mainDeckCards, setMainDeckCards] = useRecoilState(mainDeckCardsAtom)
    const [search, setSearch] = useRecoilState(searchAtom)
    const setCurrentCards = useSetRecoilState(currentCardsAtom)

    //MODALS
	const [help, setHelp] = useState(false)
	const [AIModal, setAIModal] = useState(false)
	const [needToImportCollection, setNeedToImportCollection] = useState(false)
	const [clearDeckModal, setClearDeck] = useState(false)

    //REFS
	const collectionRef  = useRef<any>(null)
	const deckRef  = useRef<any>(null)
    
    function downloadDeck(){

		let deck = '#main \n'

		mainDeckCards.map((each:decks) =>{
			deck = deck + each.cardId + '\n'
		})

		deck = deck + '\n #extra \n'

		extraDeckCards.map((each:decks) =>{
			deck = deck + each.cardId + '\n'
		})

		deck = deck + '\n !side \n'


		var blob = new Blob([deck],{type:'text/plan: chartset=utf-8'})

		saveAs(blob, 'ygodeck.ydk', )
	}

    function removeDeckFromCollection(collection:card[], deck:decks[]){
		deck.map(deckItem => {
		  
		  const index = collection.findIndex(
			collectionItem => String(collectionItem.cardId) === String(deckItem.cardId)
		  );
		  
		  if (index !== -1) {
            collection[index] = {...collection[index], quantity: parseInt(String(collection[index].quantity)) - 1}
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
                let data:csvCollection[] = results.data
				data.map((each:csvCollection)=>{
                    let index = arr.findIndex((arrCard:card) =>{
                        return arrCard.cardId == each.cardid
                    })

                    
                    if(index !== -1){
                        arr[index] = {...arr[index], quantity: parseInt(String(arr[index].quantity)) + parseInt(String(each.cardq))}
                    }else{
                        arr.push({
                            cardId: each.cardid,
					 		img: `https://images.ygoprodeck.com/images/cards_small/${each.cardid}.jpg`,
					 		cardIndexOnArray: String(each.cardid),
					 		name:each.cardname,
                            quantity:each.cardq
                        })
                    }
				})

                
				if(needToImportCollection){
					let collectionMinusMainDeck = removeDeckFromCollection(arr, mainDeckCards)
                    let finalCollection = removeDeckFromCollection(collectionMinusMainDeck, extraDeckCards)
					arr = finalCollection
				}
				
                let sortedArr = arr.sort((a:card, b:card) => parseInt(String(a.cardId)) - parseInt(String(b.cardId)))                      
				setCards(sortedArr)
				setCurrentCards(sortedArr)
                setCollection(sortedArr)
				setNeedToImportCollection(false)
			},
		});

	}
	
	const readDeck = async (event:any) =>{
		event.preventDefault()
		const reader = new FileReader()

		reader.onload = async (e) =>{
			const deck = e.target?.result
			let arrDeck = String(deck).split(/\r\n?|\n/).filter((str) =>{
				return /\S/.test(str);
			})

            let removedWhiteSpaces = arrDeck.map((each:string) =>{
                return each.replace(/ /g, '')
            })
            

			let extraIndex = removedWhiteSpaces.indexOf("#extra")
			let sideIndex = removedWhiteSpaces.indexOf("!side")

			let mainDeck = removedWhiteSpaces.slice(1, extraIndex)
			let extraDeck = removedWhiteSpaces.slice(extraIndex + 1, sideIndex)

			let auxMainDeck:decks[] = []
			let auxExtraDeck:decks[] = []

			await Promise.all(
                mainDeck.map(async (each:string) =>{
                    let random = Math.random()
                    
                    await axios.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${each}`).then((res) =>{
                        auxMainDeck.push({
                            cardId: res.data.data[0].id,
                            img: res.data.data[0].card_images[0].image_url_small, 
                            cardIndexOnArray:res.data.data[0].id +`_` + random,
                            name:res.data.data[0].name
                        })
                    })
                })
            )

			await Promise.all(
                extraDeck.map(async (each:string) =>{
                    let random = Math.random()
    
                    await axios.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${each}`).then((res) =>{
                        auxExtraDeck.push({
                            cardId: res.data.data[0].id,
                            img: res.data.data[0].card_images[0].image_url_small, 
                            cardIndexOnArray:res.data.data[0].id +`_` + random,
                            name:res.data.data[0].name
                        })
                    })
                })
            )
            

            let mainDeckSorted = auxMainDeck.sort((a:decks, b:decks) => parseInt(String(a.cardId)) - parseInt(String(b.cardId)))
            let extraDeckSorted = auxExtraDeck.sort((a:decks, b:decks) => parseInt(String(a.cardId)) - parseInt(String(b.cardId)))
			setMainDeckCards(mainDeckSorted)
			setExtraDeckCards(extraDeckSorted)
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
		let collectionString = ''

        cards.map((each:card) =>{
            collectionString+= `${each.name}: ${each.quantity}\n`
        })

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
                    <Action onClick={() => setAIModal(true)}>Otimizar com IA</Action>
                    <Action onClick={() => setHelp(true)}>Ajuda</Action>

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
                <Dialog.Content className="DialogContent bg-zinc-700 text-white border-2 border-violet-500">
                <Dialog.Title className="DialogTitle text-white">Gerador de Deck</Dialog.Title>

                <Dialog.Description>
                    <span>Para ter auxílio da IA para montar seu deck, um texto será enviado para o seu clipboard e você será redirecionado para o <strong>CHAT-GPT</strong>, lá você só precisa colar o texto e enviar</span>
                </Dialog.Description>



                <div className='w-full h-fit min-h-8 flex justify-end gap-4 '>
                    <Button aria-label="Close" onClick={() => {handleAI(), setAIModal(false)}} className='h-12 flex text-center bg-violet-500 justify-center items-center p-1 min-w-12'>
                        OK
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
                <Dialog.Content className="DialogContent bg-zinc-700 text-white border-2 border-violet-500">
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
                    <Dialog.Content className="DialogContent bg-zinc-700 text-white border-2 border-violet-500">
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
                        <button className="IconButton" aria-label="Close" onClick={() => {alert('Você precisa importar uma coleção!!!')}}>
                        <X/>
                        </button>
                    </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
			</Dialog.Root>

            <Dialog.Root open={clearDeckModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay " />
                    <Dialog.Content className="DialogContent bg-zinc-700 text-white border-2 border-violet-500">
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