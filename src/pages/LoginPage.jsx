import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider.jsx';
import { supabase } from '../lib/supabaseClient';

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
    else if (mode === 'login') navigate('/');
    else setMessage('Account wurde angelegt. Du kannst dich jetzt anmelden.');
  }

  async function resetLogin() {
    if (!email) { setMessage('Bitte zuerst deine E-Mail-Adresse eintragen.'); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/login' });
    if (error) setMessage(error.message);
    else setMessage('Wenn die E-Mail existiert, wurde ein Link zum Zurücksetzen verschickt.');
  }

  return (
    <section className="auth-card">
      <h1>{mode === 'login' ? 'Anmelden' : 'Neues Konto erstellen'}</h1>
      <form onSubmit={submit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail" required />
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Passwort" required />
        <button className="button">{mode === 'login' ? 'Anmelden' : 'Registrieren'}</button>
      </form>
      <div className="auth-actions">
        <button className="text-button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Neues Konto erstellen' : 'Zur Anmeldung'}</button>
        <button className="text-button" onClick={resetLogin}>Passwort vergessen?</button>
      </div>
      {message && <p className="notice">{message}</p>}
    </section>
  );
}
