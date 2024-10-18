import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginForm from "../../components/loginForm";
import Image from "next/image";

export default async function LoginPage() {
    const authSession = await auth();

    if (authSession?.user){
        redirect('/')
    }

    return (
        <div className="flex h-screen w-screen flex-col justify-center items-center bg-zinc-200">
            <div className=" flex flex-col items-center justify-center p-8 lg:w-[420px] sm:w-[80%] bg-zinc-50 rounded-xl shado-sm">
                <Image src="/logo_grupo.png" alt="Logo do Grupo" width={160} height={95} className=" w-40 mb-6" />
                <LoginForm />
            </div>
        </div>
    )
}
