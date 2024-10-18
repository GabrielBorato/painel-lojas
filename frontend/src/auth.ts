import NextAuth from "next-auth";
import Credentials from 'next-auth/providers/credentials';

export const { auth, signIn, signOut, handlers: { GET, POST }} = NextAuth({
    callbacks: {
        authorized({ auth }) {
            const isLoggedIn = !!auth?.user;

            if (!isLoggedIn) {
                return false;
            }

            return true;
        }
    },
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                username: { label: 'username', type: 'text' },
                password: { label: 'password', type: 'password' }
            },
            async authorize(credentials) {
                const { username, password } = credentials as {
                    username: string;
                    password: string;
                };

                const res = await fetch('https://autenticacao.superkoch.com.br/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await res.json();

               
                if (!data) {
                    return null;
                }

                const user = { 
                    id: data['NOME_CONSINCO'],
                    name: data['NOME'].slice(0, 15), 
                    email: data['NOME_AD']
                };

                return user;
            }
        })
    ],
    trustHost: true
});
