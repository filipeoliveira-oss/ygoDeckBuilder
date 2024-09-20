import { getCardInfo } from "../helpers/functions"
import { card } from "../helpers/interfaces"
import axios from 'axios'
import { CardBody, CardContainer, CardItem } from "./ui/3dCard"
import {  toast } from 'react-toastify';
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { cardsAtom, cardToInspectAtom, currentCardsAtom, extraDeckCardsAtom, isCardInspectingAtom, mainDeckCardsAtom, searchAtom } from "../helpers/atoms";


export default function Collection(){

	//ATOMS
	const [cards,setCards] = useRecoilState(cardsAtom)
	const [currentCards, setCurrentCards] = useRecoilState(currentCardsAtom)
	const [extraDeckCards, setExtraDeckCards] = useRecoilState(extraDeckCardsAtom)
	const [mainDeckCards, setMainDeckCards] = useRecoilState(mainDeckCardsAtom)
	const search = useRecoilValue(searchAtom)
	const setCardToInspect = useSetRecoilState(cardToInspectAtom)
    const setIsCardInspecting = useSetRecoilState(isCardInspectingAtom)


    function sendCardToDeck(card:card, e:any){
		e.preventDefault()
		let extraDeckTypes = ["Fusion Monster","Link Monster","Pendulum Effect Fusion Monster","Synchro Monster","Synchro Pendulum Effect Monster","Synchro Tuner Monster","XYZ Monster","XYZ Pendulum Effect Monster"]
		let fullDeck = mainDeckCards.concat(extraDeckCards)
		let quantityInDeck = fullDeck.filter((each:card) =>{
			return each.cardId == card.cardId
		})

		if(quantityInDeck.length >= 3){
			toast.error(`Você atingiu o limite máximo da carta: ${card.name}`)

			return
		}

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

    return(
        <div className={`flex h-full flex-col`}>
            <div className='flex w-full h-8 items-center gap-4 deckHeader rounded-tl-2xl rounded-tr-2xl rounded-bl-0 rounded-br-0'>
                <h1 className='font-semibold text-base tracking-tight leading-normal ml-4'>Collection</h1>
            </div>
            <div className='flex-1 flex-col overflow-x-auto grid grid-cols-cards gap-4 pb-4 h-full items-center justify-center rounded-2xl pt-2'>
				{currentCards.map((card:card)=>{
					return(
						<CardContainer key={card.cardIndexOnArray}>
							<CardBody key={card.cardIndexOnArray} className=" w-40 h-56 cursor-pointer" >
								<CardItem translateZ="90" onClick={()=> getCardInfo(card.cardId.toString(), setCardToInspect, setIsCardInspecting)} onContextMenuCapture={(e:any)=> sendCardToDeck(card, e)}>
									<img src={card.img} alt={card.cardId.toString()}/>
								</CardItem>
							</CardBody>
						</CardContainer>
					)
				})}
			</div>
        </div>
    )
}