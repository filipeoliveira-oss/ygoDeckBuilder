import { Button } from "./button"
import Checkbox from "./checkbox"

interface createNewTournament{
    handleSubmit:Function,
    handlePublic:Function,
    tournamentName:string,
    changeNameFunction:Function,
    
}

export default function CreateNewTournament({changeNameFunction,handlePublic,handleSubmit,tournamentName}:createNewTournament) {
    return (
        <div className=" w-full h-full p-4 flex flex-col justify-center items-center gap-4">
            <span className="text-2xl font-bold">Criar novo torneio</span>
            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col items-center gap-4 w-full h-full">
                <label htmlFor="name">
                    Name:
                    <input type="text" maxLength={25} className="bg-zinc-500 h-12 w-full text-2xl text-center font-semibold cursor-text" value={tournamentName} onChange={(e) => changeNameFunction(e.target.value)} name="name" id="name" />
                </label>
                <label htmlFor="public" className="flex flex-row gap-4 ">
                    Torneio público?
                    <Checkbox changeFunction={handlePublic} identifier="public" />
                </label>
                <Button className="w-40 h-8 text-lg" type="submit">Criar torneio</Button>
            </form>
        </div>
    )
}