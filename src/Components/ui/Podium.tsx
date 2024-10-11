import { CrownIcon } from "lucide-react"
import { motion } from 'framer-motion';

interface place {
    competitorName: string,
    position: 'First' | 'Second' | 'Third',
    wins:number
    losses:number,
    photoUrl:string
}

interface podium{
    first:{
        competitorId: number,
        wins: number,
        losses: number,
        competitorName: string,
        photoUrl:string
    },
    second:{
        competitorId: number,
        wins: number,
        losses: number,
        competitorName: string,
        photoUrl:string
    },
    third:{
        competitorId: number,
        wins: number,
        losses: number,
        competitorName: string,
        photoUrl:string
    },
}



export default function Podium({first,second,third}:podium) {
    const Place = ({ competitorName, position,losses,wins,photoUrl }: place) => {

        let crownColor = '';
        let translate = '';

        switch (position) {
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
                translate = '5';
                break
        }

        let style = {
            backgroundImage: `url(${photoUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }

//transform: `translateY(${translate}rem)`
        return (
            wins === 0 && losses === 0 ? <></>
            : 
            <motion.div 
                className={`rounded w-[30%] h-full flex flex-col items-center`} 
                style={{ marginTop:`${translate}rem` }}
                // key={value}
                // initial={{ opacity: 0, scale: 0.5, translateY: 0}}
                // animate={{ opacity: 1, scale: 1, translateY: `${translate}rem`  }}
                // exit={{ opacity: 0, scale: 0.5, translateY: `${translate}rem` }}
                // transition={{ duration: 1, type:"tween" }}
            >
                <div className='rounded-full h-28 w-28 text-center border-4 relative mt-4 ' style={style}>
                    <div className='absolute rounded-full h-10 w-10 bg-zinc-700 top-0 left-[50%] -translate-x-[50%] -translate-y-[70%] flex items-center justify-center'>
                        <CrownIcon fill={crownColor} stroke={crownColor} />
                    </div>
                </div>
                
                <div className="w-full h-fit flex flex-col gap-2 justify-center items-center">
                    <span className="capitalize">{competitorName}</span>
                    <span className="text-zinc-400">{wins}V/{losses}D</span>
                </div>
            </motion.div>
        )
    }

    return (
        <div className='w-full h-full flex flex-row  justify-center'>
            {second ? <Place competitorName={second?.competitorName} wins={second?.wins} losses={second?.losses} position='Second' photoUrl={second?.photoUrl} /> : ''}
            {first ?  <Place competitorName={first?.competitorName} wins={first?.wins}  losses={first?.losses} position='First' photoUrl={first?.photoUrl}/> : ''}
            {third ? <Place competitorName={third?.competitorName} wins={third?.wins}  losses={third?.losses} position='Third' photoUrl={third?.photoUrl}/> :''}
        </div>
    )
}