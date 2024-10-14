import { Trophy, X } from "lucide-react";
import { Tables } from "../../helpers/supabase";
import React, { useEffect, useState } from "react";
import * as Dialog from '@radix-ui/react-dialog'
import SelectElement from "./select";
import { Button } from "./button";
import { supabase } from "../../helpers/utils";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import { isAdminAtom } from "../../helpers/atoms";

interface brackets {
    duel: Tables<'battles'>
    competitors: Array<Tables<'competitors'>>,
    setCurrentResults:Function
}

function Brackets({ duel, competitors,setCurrentResults }: brackets) {

    //Modal
    const [editDuelModal, setEditDuelModal] = useState(false)
    const [deleteDuelModal, setDeleteDuelModal] = useState(false)
    
    //Competitors
    const [fCompetitorName, setFcompetitorName] = useState('')
    const [sCompetitorName, setScompetitorName] = useState('')
    const [fCompetitorResult, setFcompetitorResult] = useState(0)
    const [sCompetitorResult, setScompetitorResult] = useState(0)
    const isAdmin = useRecoilValue(isAdminAtom)

    useEffect(() =>{
        if(duel && fCompetitorName === ''){
            const firtsName = getCompetitorName(duel.first_competitor)
            const secondName = getCompetitorName(duel.second_competitor)

            setFcompetitorName(firtsName)
            setScompetitorName(secondName)
        }

    },[])
    
    
    function getCompetitorName(id: number) {
        const competitor = competitors.filter((competitor: Tables<'competitors'>) => {
            return competitor.competitor_id === id
        })

        return competitor[0]?.name
    }

    function handleDoubleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault()
        setEditDuelModal(true)
    }

    async function handleEditDuel(){
       const {error} = await supabase.from('battles').update({
        fcompetitor_result:fCompetitorResult,
        scompetitor_result:sCompetitorResult
       }).eq("battle_id", duel.battle_id)

       if(error){
        toast.error('Ocorreu um erro na edição, tente novamente')

        return
       }

       await setCurrentResults(duel.season_id)
       toast.success('Duelo editado com sucesso')
    }

    async function handleDeleteDuel(){
        const {error} = await supabase.from('battles').delete().eq("battle_id", duel.battle_id)

        if(error){
            toast.error('Ocorreu um erro na deleção desse duelo, tente novamente')
        
            return
        }


        await setCurrentResults(duel.season_id)
        toast.success('Duelo deletado com sucesso')
        setDeleteDuelModal(false)
        setEditDuelModal(false)
    }
    
    
    return (
        <>
            <div className="w-full h-fit flex flex-row gap-2 border-r border-zinc-500 p-0 m-0 cursor-pointer" onDoubleClickCapture={(e) => isAdmin ? handleDoubleClick(e) : ''}>
                <div className="h-28 w-16 flex flex-col items-center justify-between">
                    <div className="flex items-center justify-center  w-12 h-12 rounded-full bg-zinc-500">
                        <Trophy />
                    </div>
                    <span>vs</span>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-500">
                        <Trophy />
                    </div>
                </div>

                <div className="flex flex-col gap-4 items-center justify-center w-full h-28" >
                    <div className=" w-full h-full flex items-center px-4 justify-between border-l border-t border-b border-zinc-500">
                        <span className="w-24 capitalize">{fCompetitorName}</span>
                        <span>-</span>
                        <span>{duel.fcompetitor_result}</span>
                    </div>
                    <div className=" w-full h-full flex items-center px-4 justify-between border-l border-t border-b border-zinc-500">
                        <span className="w-24 capitalize">{sCompetitorName}</span>
                        <span>-</span>
                        <span>{duel.scompetitor_result}</span>
                    </div>
                </div>

            </div>

            <Dialog.Root open={editDuelModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay " />
                    <Dialog.Content className="DialogContent bg-zinc-700 text-white border-2 border-violet-500 w-[35rem]">
                        <Dialog.Title className="DialogTitle text-white">Editar duelo entre <span className="capitalize">{fCompetitorName}</span> x <span className="capitalize">{sCompetitorName}</span></Dialog.Title>
                        <div className="mt-4 w-full h-fit justify-between items-center flex">
                            <div className="flex flex-col gap-4">
                                {/* <SelectElement values={competitors}  placeholder="Selecione o competidor 1" label="Duelistas" /> */}
                                <span className="bg-white text-[#6E56CF] w-full h-[35px] rounded flex items-center justify-center">{fCompetitorName}</span>
                                <SelectElement values={[0, 1, 2]} placeholder={`Resultado de ${fCompetitorName}`} label="Rounds ganhos" changeFunction={setFcompetitorResult}/>

                            </div>
                            <X />
                            <div className="flex flex-col gap-4">
                                {/* <SelectElement values={competitors}  placeholder="Selecione o competidor 2" label="Duelistas" /> */}
                                <span className="bg-white text-[#6E56CF] w-full h-[35px] rounded flex items-center justify-center">{sCompetitorName}</span>
                                <SelectElement values={[0, 1, 2]} placeholder={`Resultado de ${sCompetitorName}`} label="Rounds ganhos" changeFunction={setScompetitorResult}/>
                            </div>
                        </div>

                        <div className="flex flex-col w-full h-6  mt-4">
                            {(parseInt(String(fCompetitorResult)) + parseInt(String(sCompetitorResult))) > 3 && <span className="text-red-500">A soma dos duelos ultrapassa o limite de 3</span>}
                        </div>
                        <div className="w-full h-fit flex mt-4 justify-end gap-4">

                            <Button
                                type="button" aria-label="Close"
                                className='h-12 flex text-center bg-violet-500 justify-center self-end justify-self-end items-center p-1' onClick={() => { setDeleteDuelModal(true) }}>
                                Deletar duelo
                            </Button>

                            <Button
                                disabled={(parseInt(String(fCompetitorResult)) + parseInt(String(sCompetitorResult))) > 3}
                                variant={(parseInt(String(fCompetitorResult)) + parseInt(String(sCompetitorResult))) > 3 ? 'secondary' : 'primary'}
                                type="button" aria-label="Close"
                                className='h-12 flex text-center bg-violet-500 justify-center self-end justify-self-end items-center p-1' onClick={() => { handleEditDuel() }}>
                                Confirmar
                            </Button>
                        </div>

                        <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close" onClick={() => { setEditDuelModal(false) }}>
                                <X />
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <Dialog.Root open={deleteDuelModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay " />
                    <Dialog.Content className="DialogContent bg-zinc-700 text-white border-2 border-violet-500 w-[35rem]">
                        <Dialog.Title className="DialogTitle text-white">Deletar duelo entre <span className="capitalize">{fCompetitorName}</span> x <span className="capitalize">{sCompetitorName}</span></Dialog.Title>

                        <Dialog.Description>Você tem certeza que deseja deletar esse duelo? Essa ação não pode ser desfeita.</Dialog.Description>
                        <div className="w-full h-fit flex mt-4 justify-end gap-4">

                            <Button
                                type="button" aria-label="Close"
                                className='h-12 flex text-center bg-violet-500 justify-center self-end justify-self-end items-center p-1' onClick={() => { setDeleteDuelModal(false) }}>
                                Cancelar
                            </Button>

                            <Button
                                type="button" aria-label="Close"
                                className='h-12 flex text-center bg-violet-500 justify-center self-end justify-self-end items-center p-1' onClick={() => { handleDeleteDuel() }}>
                                Deletar duelo
                            </Button>

                        </div>

                        <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close" onClick={() => { setDeleteDuelModal(false) }}>
                                <X />
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    )
}

export default React.memo(Brackets)