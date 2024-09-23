import { getCardInfo } from "../helpers/functions"
import { card, decks } from "../helpers/interfaces"
import axios from 'axios'
import { CardBody, CardContainer, CardItem } from "./ui/3dCard"
import {  toast } from 'react-toastify';
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { cardsAtom, cardToInspectAtom, currentCardsAtom, extraDeckCardsAtom, isCardInspectingAtom, mainDeckCardsAtom, screenLoaderAtom, searchAtom } from "../helpers/atoms";


export default function Collection(){

	//ATOMS
	const [cards,setCards] = useRecoilState(cardsAtom)
	const [currentCards, setCurrentCards] = useRecoilState(currentCardsAtom)
	const [extraDeckCards, setExtraDeckCards] = useRecoilState(extraDeckCardsAtom)
	const [mainDeckCards, setMainDeckCards] = useRecoilState(mainDeckCardsAtom)
	const search = useRecoilValue(searchAtom)
	const setCardToInspect = useSetRecoilState(cardToInspectAtom)
    const setIsCardInspecting = useSetRecoilState(isCardInspectingAtom)
	const setLoadingScreen = useSetRecoilState(screenLoaderAtom) 

    async function sendCardToDeck(card:card, e:any){
		e.preventDefault()
		let extraDeckTypes = ["Fusion Monster","Link Monster","Pendulum Effect Fusion Monster","Synchro Monster","Synchro Pendulum Effect Monster","Synchro Tuner Monster","XYZ Monster","XYZ Pendulum Effect Monster"]
		let fullDeck = mainDeckCards.concat(extraDeckCards)

		let quantityInDeck = fullDeck.filter((each:decks) =>{
			return each.cardId == card.cardId
		})

		if(quantityInDeck.length >= 3){
			toast.error(`Você atingiu o limite máximo da carta: ${card.name}`)
			return
		}



		const promise = axios.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${card.cardId}`).then((res) =>{
			let type = res.data.data[0].type
			let collectionArray = [...cards]
			let index = collectionArray.findIndex((each:card) =>{
				return each.cardId == card.cardId
			})

			let currentQuantity = collectionArray[index].quantity
			if(index !== -1 && collectionArray[index].quantity > 0){
				collectionArray[index] = {...collectionArray[index], quantity: parseInt(String(currentQuantity)) - 1 }
			}
			
			if(index === -1){
				toast.error('Ocorreu um erro no servidor, tente novamente')
				return
			}

			if(extraDeckTypes.some((extraType:string) =>{return extraType === type})){
				let auxCard = {...card, cardIndexOnArray: String(Math.random())}
				setExtraDeckCards([...extraDeckCards,auxCard])
			}
			else{
				let auxCard = {...card, cardIndexOnArray: String(Math.random())}
				setMainDeckCards([...mainDeckCards,auxCard])
			}

			let collectionArraySorted = collectionArray.filter((each:card) =>{return each.name.toLowerCase().includes(search.toLowerCase())})
			setCards(collectionArray)
			setCurrentCards(collectionArraySorted)
		})

		const loadingTimeoutPromise = setTimeout((resolve) => {
			setLoadingScreen(true)
			resolve()
		}, 1000);

		await Promise.race([loadingTimeoutPromise, promise])

		await promise

		clearTimeout(loadingTimeoutPromise)
		setLoadingScreen(false)

	}

	async function inspectCard(card:card){

		const loadingTimeoutPromise = setTimeout((resolve) => {
			setLoadingScreen(true)
			resolve()
		}, 1000);

		const promise = getCardInfo(card.cardId.toString(), setCardToInspect, setIsCardInspecting)

		await Promise.race([loadingTimeoutPromise, promise])

		await promise

		clearTimeout(loadingTimeoutPromise)
		setLoadingScreen(false)
	}

    return(
        <div className={`flex h-full flex-col`}>
            <div className='flex w-full h-8 items-center gap-4 deckHeader rounded-tl-2xl rounded-tr-2xl rounded-bl-0 rounded-br-0'>
                <h1 className='font-semibold text-base tracking-tight leading-normal ml-4'>Collection</h1>
            </div>
            <div className='flex-1 flex-col overflow-x-auto grid grid-cols-cards gap-4 pb-4 h-full rounded-2xl pt-2 px-4 select-none'>
				{currentCards.filter((each:card) =>{ return each.quantity >0 }).map((card:card)=>{
					return(
						<CardContainer key={card.cardIndexOnArray} >
							<CardBody key={card.cardIndexOnArray} className=" w-40 h-56 cursor-pointer" >
								<CardItem translateZ="90" onClick={()=>inspectCard(card)} onContextMenuCapture={(e:any)=> sendCardToDeck(card, e)}>
									<div className="relative">
										<div className="absolute top-0 right-2 w-6 h-8 bg-[#7D3E12] cardQtdCounter text-center">
											{card.quantity}
										</div>
										<img src={card.img} alt={card.cardId.toString()}/>
									</div>
								</CardItem>
							</CardBody>
						</CardContainer>
					)
				})}
			</div>
        </div>
    )
}