import React, { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { supabase } from "../helpers/utils"
import { toast } from 'react-toastify';
import { Tables } from "../helpers/supabase";
import { User } from "@supabase/supabase-js";
import CreateNewTournament from "./ui/createNewTournament";
import JoinTournament from "./ui/joinTournament";

export default function NoTournament({ setTournaments, setLoading, userSession, searchParamsCode,setTournamentId }: { setTournaments: Function, setLoading: Function, userSession: User, searchParamsCode:string | null, setTournamentId:Function}) {

    const [code, setCode] = useState('')
    const [creating, setCreation] = useState(false)
    const [tournamentName, setTournamentName] = useState('')
    const [publicTournament, setPublicTournament] = useState(false)
    const [seasonName, setSeasonName] = useState('')
    

    async function handleEnter(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!code) {
            toast.error('Digite um código válido')
            return
        }

        setLoading(true)
        const { data, error } = await supabase.from('tournaments').select().eq('tournament_id', code).limit(1).returns<Tables<'tournaments'>[]>()

        if (error) {
            toast.error('Algo inesperado aconteceu, tente novamente!')
            return
        }

        if (data.length < 1) {
            toast.error('Esse código de torneio não existe')
            return
        }

        if (data[0].active === false) {
            toast.error('Esse torneio não está mais disponível')
            return
        }

        if (data[0].is_public === false) {

            const { data, error } = await supabase.from('competitors').select().eq("tournament_id", code).eq("competitor_status", "WAPPR")

            if (error) {
                toast.error('Ocorreu um erro inesperado, tente novamente!')
                return
            }

            if (data.length > 0) {
                if (userSession.email) {
                    const { error } = await supabase.from('competitors')
                        .update({
                            competitor_status: "APPR"
                        })
                        .eq("competitor_email", userSession.email)
                        .eq("tournament_id", code)


                    if (error) {
                        toast.error('Ocorreu um erro inesperado, tente novamente!')
                        return
                    }
                }
            } else {
                toast.error('Seu email não consta na lista de convidados ou você já está nesse torneio. Por favor, entre em contato com um administrador')
                return
            }
        }

        if (data[0].is_public === true) {
            const { error } = await supabase.from('competitors').insert({
                name: userSession.user_metadata.full_name,
                tournament_id: parseInt(code),
                competitor_email: userSession.email,
            })

            if (error) {
                toast.error('Ocorreu um erro na inserção, tente novamente')
                return
            }
        }

        const { data: Tournaments, error: TournamentsError } = await supabase.from('competitors').select(`tournaments(tournament_id, tournament_name, active, is_public)`).eq('competitor_email', (userSession.email || '')).eq("competitor_status", "APPR")

        if (!TournamentsError && Tournaments?.length > 0) {
            setTournaments(Tournaments)
            toast.success('Juntou-se com sucesso!')
        }

        setLoading(false)
    }


    async function handleCreation(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()


        setLoading(true)
        const { data: TournamentData, error: TournamentError } = await supabase.from('tournaments').insert({
            active: true,
            is_public: publicTournament,
            tournament_name: tournamentName
        }).select()

        if (TournamentError) {
            toast.error('Ocorreu um erro durante a criação do torneio, tente novamente.')
            return
        }

        if (TournamentData) {
            const { error: CompetitorError } = await supabase.from('competitors').insert({
                name: userSession.user_metadata.full_name,
                tournament_id: TournamentData[0]?.tournament_id,
                competitor_email: userSession.email,
                isAdmin: true,
                competitor_status:"APPR"
            })

            const {error: SeasonError} = await supabase.from('seasons').insert({
                tournament_id: TournamentData[0]?.tournament_id,
                season_name:seasonName || 'Temporada 1',
                season_status:"CURRENT"
            })

            if (CompetitorError || SeasonError) {
                toast.error('Ocorreu um erro durante a criação do torneio, tente novamente.')
                return
            }
        }


        const { data: Tournaments, error: TournamentsError } = await supabase.from('competitors').select(`tournaments(tournament_id, tournament_name, active, is_public)`).eq('competitor_email', (userSession.email || ''))

        if (!TournamentsError) {
            setTournaments(Tournaments)
            toast.success('Torneio criado com sucesso!')
            setTournamentId(TournamentData[0].tournament_id)
            setTournamentName(TournamentData[0].tournament_name)
        }




        setLoading(false)

    }

    useEffect(() =>{
        if(searchParamsCode ){
            setCode(searchParamsCode)
        }

    },[])
    
    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="min-h-[40%] h-fit w-[30%] flex flex-col justify-center items-center bg-zinc-700 gap-8">
                {creating ?
                    <div className=" w-full h-full p-4 flex flex-col justify-center items-center gap-4">
                        <CreateNewTournament changeNameFunction={setTournamentName} tournamentName={tournamentName} handlePublic={setPublicTournament} handleSubmit={handleCreation} seasonName={seasonName} changeSeasonName={setSeasonName}/>
                        <Button className="w-40 h-8 text-lg bg-zinc-600" onClick={() => { setCreation(false) }}>Digitar código</Button>
                    </div>
                    :
                    <>
                        <JoinTournament changeCode={setCode} code={code} handleSubmit={handleEnter}/>
                        <Button className="w-40 h-8 text-lg bg-zinc-600" onClick={() => { setCreation(true) }}>Criar torneio</Button>
                    </>
                }
            </div>
        </div>
    )
}