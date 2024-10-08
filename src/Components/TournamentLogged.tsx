import { useEffect, useState } from "react"
import { supabase } from "../helpers/utils"
import NoTournament from "./noTournament"
import { User } from '@supabase/supabase-js';

export default function TournamentLogged({ userSession,setLoader }: { userSession: User,setLoader:Function }) {

    const [tournaments, setTournaments] = useState<Array<any>>()

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

    useEffect(() => {
        getTournaments().then((tournaments: any) => {
            setTournaments(tournaments)
        })
    }, [])

    const HasTournament = () => {
        return (
            <div className="border border-red-500 w-full h-full">
                logged area
                {/* <div className="h-full w-[60%] border border-red-400">
                </div> */}

                {/* <div className="h-full w-[40%] bg-blue-500">

                </div> */}
            </div>
        )
    }

    return (
        <div className="h-full w-full flex flex-row gap-4">
            {tournaments && tournaments?.length > 0 ?
                <HasTournament /> : <NoTournament setLoading={() => { }} setTournaments={setTournaments} userSession={userSession} />
            }
        </div>
    )
}