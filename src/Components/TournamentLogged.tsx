import { useEffect, useState } from "react"
import { supabase } from "../helpers/utils"
import NoTournament from "./noTournament"
import { User } from '@supabase/supabase-js';
import Podium from "./ui/positions/Podium";
import { Tables } from "../helpers/supabase";

interface tournamentLoged{
    userSession: User,
    setLoader:Function,
    seasons:Array<Tables<'seasons'>>
}

export default function TournamentLogged({ userSession,setLoader ,seasons}: tournamentLoged) {

    const [tournaments, setTournaments] = useState<Array<any>>([1])

    async function getTournaments() {
        setLoader(true)
        const { data, error } = await supabase.from('competitors')
            .select(`tournaments(tournament_id, tournament_name, active, is_public)`)
            .eq('competitor_email', (userSession.email || ''))
            .eq('competitor_status','APPR')

        if (error) {
            throw new Error('Error during tournaments fetching')
        }

        setLoader(false)
        return data
    }


    // useEffect(() => {
    //     if(userSession){
    //         getTournaments().then((tournaments: any) => {
    //             setTournaments(tournaments)
    //         })
    //     }
    // }, [userSession])

    const HasTournament = () => {
        return (
            <div className="border w-full h-full">
                <div className="h-full w-[50%] border border-red-400 flex flex-col">
                    <div className='flex w-full h-8 items-center gap-4 deckHeader rounded-tl-2xl rounded-tr-2xl rounded-bl-0 rounded-br-0'>
                        <h1 className='font-semibold text-base tracking-tight leading-normal ml-4'>{seasons[0]?.season_name}</h1>
                    </div>
                    <div className="w-full h-[30%] px-4 flex items-center justify-center">
                        <Podium/>
                    </div>
                </div>

                {/* <div className="h-full w-[50%] bg-blue-500">

                </div> */}
            </div>
        )
    }

    return (
        <div className="h-full w-full flex flex-row gap-4">
            {tournaments && tournaments?.length > 0 ?
                <HasTournament /> : <NoTournament setLoading={setLoader} setTournaments={setTournaments} userSession={userSession} />
            }
        </div>
    )
}