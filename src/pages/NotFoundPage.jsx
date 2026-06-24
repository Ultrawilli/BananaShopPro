import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="panel">
      <h1>Seite nicht gefunden</h1>
      <p>Diese Adresse gibt es im Shop nicht.</p>
      <Link className="button" to="/">Zur Startseite</Link>
    </section>
  );
}
