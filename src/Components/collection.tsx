import { getCardInfo } from "../helpers/functions"
import { card } from "../helpers/interfaces"
import axios from 'axios'

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
        <div className='flex-1 flex-col overflow-x-auto grid grid-cols-cards gap-4 pb-4'>
            {currentCards.map((card:card)=>{
                return(
                    <div key={card.cardIndexOnArray} className=" w-40 h-56 cursor-pointer" onClick={()=> getCardInfo(card.cardId.toString(), setCardToInspect, setIsCardInspecting)} onContextMenuCapture={(e)=> sendCardToDeck(card, e)}>
                        <img src={card.img} alt={card.cardId.toString()}/>
                    </div>
                )
            })}
        </div>
    )
}