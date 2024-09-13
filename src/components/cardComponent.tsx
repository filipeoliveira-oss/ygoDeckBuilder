interface card{
    id: string | number,
    img: string
}

export default function CardComponent({card}:{card: card}){
    return(
        <div key={card.id} className="bg-red-500 w-40 h-56 cursor-grab active:cursor-grabbing">
            <img src={card.img} alt={card.id.toString()} />
        </div>
    )
}