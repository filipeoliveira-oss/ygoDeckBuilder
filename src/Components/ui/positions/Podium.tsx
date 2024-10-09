import { CrownIcon } from "lucide-react"

interface podium{
    name:string,
    position: 'First' | 'Second' | 'Third'
}

export default function Podium(){

    const Place = ({name, position} :podium) =>{

        let crownColor = '';
        let translate = '';

        switch(position){
            case "First":
                crownColor = 'gold';
                translate = '0';
            break
            case "Second":
                crownColor = 'silver';
                translate = '3';
            break
            case "Third":
                crownColor = '#CD7F32';
                translate = '6';
            break
        }

        let style={
            backgroundImage: `url(https://i.pinimg.com/736x/d1/46/7b/d1467b8103a9e846b1a7605d169c9f5e.jpg)`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
          }


        return(
            <div className={`rounded w-[30%] h-[70%] flex flex-col items-center justify-cente`} style={{transform: `translateY(${translate}rem)`}}>
                <div className='rounded-full h-28 w-28 text-center border-4 relative mt-4 ' style={style}>
                    <div className='absolute rounded-full h-10 w-10 bg-zinc-700 top-0 left-[50%] -translate-x-[50%] -translate-y-[70%] flex items-center justify-center'>
                        <CrownIcon fill={crownColor} stroke={crownColor}/>
                    </div>
                </div>
                <div className="w-full h-fit flex flex-col gap-2 justify-center items-center">
                    <span>{name}</span>
                    <span className="text-zinc-400">victories</span>
                </div>
            </div>
        )
    }

    return(
        <div className='w-full h-full flex flex-row items-center justify-center'>
            <Place name='Filipe' position='Second'/>
            <Place name='Murta' position='First'/>
            <Place name='Cubas' position='Third'/>
        </div>
    )
}