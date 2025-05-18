'use client';
import Head from 'next/head';
import Form from 'next/form'
import styles from "./page.module.css";
import { useState } from 'react';
import type { ChangeEvent } from 'react'; // Import the ChangeEvent type

/* function Button() {
  function handleClick() {
    alert("submitted");
  }
  
  return (
    <button onClick={handleClick}>Submit</button>
  );
} */

export default function Main() {
  const [slider1Value, setSlider1Value] = useState<number>(50);
  const [slider2Value, setSlider2Value] = useState<number>(50);
  const [slider3Value, setSlider3Value] = useState<number>(50);
  const [slider4Value, setSlider4Value] = useState<number>(50);
  const [checkbox1Checked, setCheckbox1Checked] = useState<boolean>(false);
  const [checkbox2Checked, setCheckbox2Checked] = useState<boolean>(true);

  const handleSlider1Change = (e: ChangeEvent<HTMLInputElement>) => {
    setSlider1Value(parseInt(e.target.value, 10)); // Convert to number (base 10)
  };

  const handleSlider2Change = (e: ChangeEvent<HTMLInputElement>) => {
    setSlider2Value(parseInt(e.target.value, 10));
  };

  const handleSlider3Change = (e: ChangeEvent<HTMLInputElement>) => {
    setSlider3Value(parseInt(e.target.value, 10));
  };

  const handleSlider4Change = (e: ChangeEvent<HTMLInputElement>) => {
    setSlider4Value(parseInt(e.target.value, 10));
  };

  const handleCheckboxChange = (
    setter: (checked: boolean) => void,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setter(event.target.checked);
  };

  return (
    <div>
      <Head>
        <title>My Next.js App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <nav>
            <h2>FireSight</h2>
          <ul>
            <li><a href="#">Link 1</a></li>
            <li><a href="#">Link 2</a></li>
            <li><a href="#">Link 3</a></li>
          </ul>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.mapContainer}>
            <iframe title="map" src="about:blank" width="100%" height="100%" style={{ border: '1px solid #ccc'}}></iframe>
          </div>

          <div className={styles.controls}>
            <h3>Enter something here</h3>
            <form action="#" method="get" style={{ all: 'inherit' }}>
            <input type="text" placeholder="Text Input 1" className={styles.inputField} required />
            <input type="text" placeholder="Text Input 2" className={styles.inputField} />

            <div className={styles.sliderRow}>
              <p>Slider 1</p>
              <input
                type="range"
                min="0"
                max="100"
                value={slider1Value}
                onChange={handleSlider1Change} // Use the new handler
                className={styles.slider}
              />
              <div className={styles.sliderValue}>{slider1Value}</div>
            </div>

            <div className={styles.sliderRow}>
              <p>Slider 2</p>
              <input
                type="range"
                min="0"
                max="100"
                value={slider2Value}
                onChange={handleSlider2Change} // Use the new handler
                className={styles.slider}
              />
              <div className={styles.sliderValue}>{slider2Value}</div>
            </div>

            <div className={styles.sliderRow}>
              <p>Slider 3</p>
              <input
                type="range"
                min="0"
                max="100"
                value={slider3Value}
                onChange={handleSlider3Change} // Use the new handler
                className={styles.slider}
              />
              <div className={styles.sliderValue}>{slider3Value}</div>
            </div>

            <div className={styles.sliderRow}>
              <p>Slider 4</p>
              <input
                type="range"
                min="0"
                max="100"
                value={slider4Value}
                onChange={handleSlider4Change} // Use the new handler
                className={styles.slider}
              />
              <div className={styles.sliderValue}>{slider4Value}</div>
            </div>

            <div className={styles.checkBoxRow}>
              <label htmlFor="checkbox1">Checkbox 1</label>
              <input
                type="checkbox"
                id="checkbox1"
                checked={checkbox1Checked}
                onChange={(e) => handleCheckboxChange(setCheckbox1Checked, e)}
                className={styles.checkbox}
              />
            </div>
            <div className={styles.checkBoxRow}>
              <label htmlFor="checkbox2">Checkbox 2</label>
              <input
                type="checkbox"
                id="checkbox2"
                checked={checkbox2Checked}
                onChange={(e) => handleCheckboxChange(setCheckbox2Checked, e)}
                className={styles.checkbox}
              />
            </div>
            <button type="submit">Submit</button>
            </form>
            {/* The button will take a snapshot of all the input values and add them to a CSV */}
            <div className={styles.uploadButton}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 4v14" />
              </svg>
              <label style={{padding: '5px'}}>Upload Image</label>
              <input type="file" accept="image/png, image/jpeg" style={{ padding: '10px'}} />
            </div>
            <div className={styles.placeholderText}>
              <p>Placeholder text block 2.</p>
              <p>More placeholder text here.</p>
            </div>
          </div>
          <div className={styles.infoPanel}>
            <div className={styles.profile}>
              <div className={styles.placeholderImage}></div>
              <div className={styles.profileText}>Firstname LastName</div>
            </div>

            <div className={styles.textContainer}>
              <div className={styles.placeholderText}>
                <p>Placeholder text block 1.</p>
                <p>More placeholder text here.</p>
              </div>
              <br />
              <br />
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 Idk</p>
      </footer>
    </div>
  );
}