import { auth } from "@/auth";
import Navbar from "@/components/navbar";
import { redirect } from "next/navigation";

interface queryParamsProps{
    searchParams: Record<string, string> | null | undefined;
}

export default async function CommandCenterPage({ searchParams } : queryParamsProps) {
    const authSession = await auth();
    if (!authSession?.user || searchParams?.logout){
        redirect('/login')
    }
    
    return (
          <main className="flex flex-col justify-between h-screen bg-zinc-200">
            <Navbar user={authSession.user} />
            <section className="flex h-[90%] p-10">
                <div className="flex flex-col border rounded-xl shadow-lg w-full bg-white p-8 pr-6 gap-6">
            
                </div>
            </section>
          </main>
      );
}
