"use client";
import { useFormState, useFormStatus } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { login } from "@/actions/next-auth";

function LoginPageButton() {
    const { pending } = useFormStatus()

    return(
        <button type="submit" aria-disabled={pending} className="flex flex-row w-full justify-center gap-2 items-center rounded-xl bg-blue-900 px-4 py-2 font-semibold text-white shadow-md hover:bg-blue-800 hover:scale-105 transition-transform">
            <FontAwesomeIcon icon={faRightToBracket} width={20} height={20} className='min-w-5 min-h-5'/>
            Entrar
        </button>
    )
}

export default function LoginForm() {
    const [ state, formAction ] = useFormState( login, null )

    return (
        <form className="flex flex-col gap-6 w-full" action={formAction}>
            <div>
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Usuário:</label>
                <div className="mt-2">
                    <input id="username" name="username" type="text" required placeholder="Insira seu usuário consinco" className="border rounded-xl py-2 px-4 border-zinc-200 focus:border-zinc-300 shadow-sm outline-none w-full"/>
                </div>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Senha:</label>
                <div className="mt-2">
                    <input id="password" name="password" type="password" required placeholder="Insira sua senha consinco" className="border rounded-xl py-2 px-4 border-zinc-200 focus:border-zinc-300 shadow-sm outline-none w-full"/>
                </div>
            </div>
            <p className={`font-semibold text-center ${!state?.message ? "hidden" : ""} ${state?.message.includes('incorreto') ? 'text-red-500' : ''}`}>{state?.message}</p>

            <div>
                <LoginPageButton />
            </div>
            
        </form>
    )
}
