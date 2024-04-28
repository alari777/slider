import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                const res = await fetch(`${process.env.JAVA_BACKEND_URL}/api/login`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: credentials.username,
                        password: credentials.password
                    })
                });

                const user = await res.json();

                // Если в ответе есть user data, аутентификация прошла успешно
                if (res.ok && user) {
                    return user;
                }
                // Возвращаем null, если аутентификация не удалась
                return null;
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            // При успешной аутентификации добавьте user в token
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        session: async ({ session, token }) => {
            // Передайте данные пользователя в сессию
            session.user.id = token.id;
            return session;
        }
    }
});


import { signIn, useSession } from "next-auth/react";

function LoginPage() {
    const { data: session } = useSession();
    const handleSubmit = async (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;

        const result = await signIn('credentials', {
            redirect: false,
            username,
            password
        });

        if (!result.error) {
            // Обработка успешного входа
            console.log("Успешный вход!");
        } else {
            // Обработка ошибок входа
            console.log("Ошибка входа:", result.error);
        }
    };

    if (session) {
        return <p>Вы вошли как {session.user.email}</p>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input name="username" type="text" required />
            <label htmlFor="password">Password</label>
            <input name="password" type="password" required />
            <button type="submit">Login</button>
        </form>
    );
}

export default LoginPage;


import { useSession } from "next-auth/react";

function ProtectedComponent() {
    const { data: session, status } = useSession();
    const loading = status === "loading";

    if (loading) {
        return <p>Загрузка...</p>;
    }

    if (!session) {
        return <p>Доступ запрещен. Пожалуйста, <a href="/login">войдите</a>.</p>;
    }

    return (
        <div>
            <h1>Защищенный компонент</h1>
            <p>Доступ разрешен, {session.user.email}</p>
        </div>
    );
}

export default ProtectedComponent;
