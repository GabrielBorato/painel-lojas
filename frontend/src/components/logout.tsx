"use client";
import { logout } from "@/actions/next-auth";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormState, useFormStatus } from "react-dom";

function Button() {
    const { pending } = useFormStatus()
    
    return(
        <button type="submit" aria-disabled={pending} className="flex w-full gap-2 justify-center items-center font-semibold shadow-md text-white bg-red-700 py-2 px-4 rounded-xl transition-transform hover:bg-red-600 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700">
            <FontAwesomeIcon icon={faRightToBracket} width={20} height={20} className='min-w-5 min-h-5'/>
            Sair
        </button>
    )
}

export default function Logout() {
    const [ state, formAction ] = useFormState( logout, null )
  
    return(
        <form action={formAction}>
            <Button />
        </form>
    );
}