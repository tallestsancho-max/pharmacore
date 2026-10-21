import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "PLACEHOLDER_ID",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "PLACEHOLDER_SECRET",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        // Simple default administrator credential check for quick local development testing
        if (credentials.email === "admin@pharmacy.com" && credentials.password === "password123") {
          return { id: "admin-node", name: "Head Pharmacist", email: credentials.email, role: credentials.role };
        }
        // Fallback null rejection if matching data conditions drop
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role;
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_key_minimum_32_characters_long",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
