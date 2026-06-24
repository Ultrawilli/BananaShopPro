import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider.jsx';

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [mode, setMode] = useState('login');
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    setMessage('');
    const action = mode === 'login' ? signIn : signUp;
    const { error } = await action(email, pw);
    if (error) setMessage(error.message);
    else navigate('/');
  }

  return (
    <section className="auth-card">
      <h1>{mode === 'login' ? 'Login' : 'Registrieren'}</h1>
      <form onSubmit={submit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail" required />
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Kennwort" required />
        <button className="button">OK</button>
      </form>
      <button className="text-button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>Wechseln</button>
      {message && <p className="notice">{message}</p>}
    </section>
  );
}
