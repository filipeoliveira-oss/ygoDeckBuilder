import { useState } from "react"
import { card } from "../helpers/interfaces"
import { getCardInfo } from "../helpers/functions"

interface extraDeckInterface{
    cards:card[],
    search:string,
    setExtraDeckCards:Function
    extraDeckCards:card[],
    setCards:Function,
    setCurrentCards:Function,
    setCardToInspect:Function, 
    setIsCardInspecting:Function,
}

export default function ExtraDeck({cards,search,setExtraDeckCards,extraDeckCards,setCards,setCurrentCards,setCardToInspect,setIsCardInspecting} :extraDeckInterface){

	const [showExtraDeck, setShowExtraDeck] = useState(true)

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
                        <div key={each.cardIndexOnArray} className="w-40 h-56 cursor-pointer" onClick={() => getCardInfo(each.cardId.toString(), setCardToInspect, setIsCardInspecting)} onContextMenu={(e) => removeCardFromExtraDeck(each, e)}>
                            <img src={each.img} alt={each.cardId.toString()}/>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}