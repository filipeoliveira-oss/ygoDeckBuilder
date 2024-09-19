import { useState } from "react"
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

	const [showMainDeck, setShowMainDeck] = useState(true)

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
        <div className={`flex bg-blue-500 h-${showMainDeck && mainDeckCards.length > 0  ? 'full': 'fit'} flex-col gap-2`} >
            <div className='flex w-full h-fit items-center justify-between px-4 cursor-pointer' onClick={()=>{setShowMainDeck(!showMainDeck)}}>
                <div className='flex gap-4 items-center'>
                    <h1 className='font-medium text-sm tracking-tight leading-normal '>Main Deck</h1>
                    <span>{mainDeckCards.length}/40</span>
                </div>
                <span className={showMainDeck ? 'rotate-90' : 'rotate-0'} >&gt;</span>
            </div>
            <div className={`h-full bg-zinc-950 w-full  grid grid-cols-cards gap-4 overflow-auto ${showMainDeck ? '':'hidden'}`}>
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