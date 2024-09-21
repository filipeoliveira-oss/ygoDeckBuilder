import axios from 'axios'


export function getCardInfo(cardid:string, setCardToInspect:Function, setIsCardInspecting:Function){
    let promise = axios.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${cardid}`).then((res) =>{
        setCardToInspect(res.data.data[0])
        setIsCardInspecting(true)
    })

    return promise
}

