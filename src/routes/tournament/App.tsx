
import { ShootingStars } from '../../Components/ui/shootingStars';
import { StarsBackground } from '../../Components/ui/starsBackground';
import ScreenLoader from '../../Components/ui/screenLoader';
import { useState } from 'react';

export default function Tournament(){

	const [loader, SetLoader] = useState(false)
    const [tournamentId, setTournamentId] = useState('')

    

    return(
        <>
            <ShootingStars starWidth={20} starHeight={2} minDelay={3000} maxDelay={4200}/>
			<StarsBackground starDensity={0.00130}/>
			{loader && <ScreenLoader/>}
            <div className='flex flex-row relative'>
                
            </div>
        </>
    )
}