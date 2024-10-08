import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import './dropDown.css';
import { Action } from './headerAction';
import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

interface tournamentDropdow{
    // tournamentId:number,
    setTournamentId:Function,
    userTournaments:Array<any>,
    tournamentId:number
}



export default function TournamentDropdown({setTournamentId,userTournaments,tournamentId}:tournamentDropdow) {

    const [selected, setSelected] = useState<number>(0)

    function handleChange(e:string){
        setTournamentId(parseInt(e))
        setSelected(parseInt(e))
    }

    useEffect(() =>{
        setSelected(tournamentId)
    },[tournamentId])

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <Action>Torneios</Action>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
                    <DropdownMenu.Label className="DropdownMenuLabel">Torneios disponíveis</DropdownMenu.Label>
                    <DropdownMenu.RadioGroup onValueChange={(e) => handleChange(e)} >
                        {userTournaments?.map((tournament:any) =>{
                            return(
                                <DropdownMenu.RadioItem className="DropdownMenuRadioItem cursor-pointer" value={tournament.tournaments.tournament_id} key={tournament.tournaments.tournament_id}>
                                    {selected == tournament.tournaments.tournament_id && <Check className='absolute -translate-x-6'/>}
                                    {tournament.tournaments.tournament_name}
                                </DropdownMenu.RadioItem>
                            )
                        })}
                    </DropdownMenu.RadioGroup>

                    <DropdownMenu.Arrow className="DropdownMenuArrow" />
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};

