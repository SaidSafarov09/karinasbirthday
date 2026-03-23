import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Hero from './components/Hero/Hero';
import Info from './components/Info/Info';
import RSVP from './components/RSVP/RSVP';
import MinionDecoration from './components/MinionDecoration/MinionDecoration';
import styles from './App.module.scss';

function App() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || 'Друг';

  return (
    <div className={styles.appContainer}>
      <MinionDecoration />
      <Hero name={name} />
      <div className={styles.contentWrapper}>
        <Info />
        <RSVP />
      </div>
    </div>
  );
}

export default App;
