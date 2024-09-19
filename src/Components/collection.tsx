import { getCardInfo } from "../helpers/functions"
import { card } from "../helpers/interfaces"
import axios from 'axios'
import { CardBody, CardContainer, CardItem } from "./ui/3dCard"

interface collectionInterface{
    currentCards:card[],
    setCardToInspect:Function, 
    setIsCardInspecting:Function,
    setExtraDeckCards:Function,
    setCards:Function,
    setCurrentCards:Function,
    cards:card[],
    search:string
    extraDeckCards:card[],
    setMainDeckCards:Function,
    mainDeckCards:card[]
}

export default function Collection({currentCards,setCardToInspect,setIsCardInspecting,setCards,setCurrentCards,setExtraDeckCards,cards,search,extraDeckCards,mainDeckCards,setMainDeckCards}:collectionInterface){

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

    return(
        <div className={`flex h-full flex-col`}>
            <div className='flex w-full h-8 items-center gap-4 deckHeader rounded-tl-2xl rounded-tr-2xl rounded-bl-0 rounded-br-0'>
                <h1 className='font-semibold text-base tracking-tight leading-normal ml-4'>Collection</h1>
            </div>
            <div className='flex-1 flex-col overflow-x-auto grid grid-cols-cards gap-4 pb-4 h-full items-center justify-center rounded-2xl pt-2'>
				{currentCards.map((card:card)=>{
					return(
						<CardContainer>
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