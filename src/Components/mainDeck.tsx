import { card } from "../helpers/interfaces"
import { getCardInfo } from "../helpers/functions"

interface mainDeckInterface{
    mainDeckCards: card[],
    setCardToInspect:Function, 
    setIsCardInspecting:Function,
    setMainDeckCards:Function,
    setCards:Function,
    setCurrentCards:Function,
    cards:card[],
    search:string
}

export default function MainDeck({mainDeckCards,setCardToInspect,setIsCardInspecting,setCards,setCurrentCards,setMainDeckCards,cards,search} :mainDeckInterface){
    
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

    return(
        <div className={`flex h-full flex-col gap-2 rounded-tl-2xl rounded-tr-2xl rounded-bl-0 rounded-br-0`} >
            <div className='flex w-full h-8 items-center gap-4 deckHeader rounded-tl-2xl rounded-tr-2xl rounded-bl-0 rounded-br-0'>
                <h1 className='font-semibold text-base tracking-tight leading-normal ml-4'>Main Deck</h1>
                <span className="font-semibold text-base">{mainDeckCards.length} </span>
            </div>
            <div className={`h-full bg-transparent w-full grid grid-cols-cards gap-4 overflow-auto px-4 pb-4`}>
                {mainDeckCards.map((each:card) =>{
                    return(
                        <div key={each.cardIndexOnArray} className=" w-40 h-56 cursor-pointer" onClick={() => getCardInfo(each.cardId.toString(),setCardToInspect, setIsCardInspecting)} onContextMenu={(e) => removeCardFromMainDeck(each, e)}>
                            <img src={each.img} alt={each.cardId.toString()}/>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}