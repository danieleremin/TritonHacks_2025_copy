'use client';
import Head from 'next/head';
import styles from "./page.module.css";
import { useState, FormEvent, ChangeEvent, useRef } from 'react';

export default function Main() {
  const [textInput1, setTextInput1] = useState<string>('');
  const [textInput2, setTextInput2] = useState<string>('');
  const [slider1Value, setSlider1Value] = useState<number>(50);
  const [slider2Value, setSlider2Value] = useState<number>(50);
  const [slider3Value, setSlider3Value] = useState<number>(50);
  const [slider4Value, setSlider4Value] = useState<number>(50);
  const [checkbox1Checked, setCheckbox1Checked] = useState<boolean>(false);
  const [checkbox2Checked, setCheckbox2Checked] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleSubmit = async (e: FormEvent) => {
      e.preventDefault(); // Prevent default form submission

      const formData = {
          textInput1: textInput1,
          textInput2: textInput2,
          slider1Value: slider1Value,
          slider2Value: slider2Value,
          slider3Value: slider3Value,
          slider4Value: slider4Value,
          checkbox1Checked: checkbox1Checked,
          checkbox2Checked: checkbox2Checked,
      };

      try {
          console.log(formData);
          const response = await fetch('/api/formSubmit', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
          });

          if (response.ok) {
              alert('Form data saved!');
              // Optionally, reset the form here
              setTextInput1('');
              setTextInput2('');
              setSlider1Value(50);
              setSlider2Value(50);
              setSlider3Value(50);
              setSlider4Value(50);
              setCheckbox1Checked(false);
              setCheckbox2Checked(true);
          } else {
              alert('Error saving form data.');
          }
      } catch (error) {
          console.error('Error submitting form:', error);
          alert('Error submitting form.');
      }
  };

const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
          alert("Please select a file");
          return;
      }

      const formData = new FormData();
      formData.append('image', file);

      try {
          const response = await fetch('/api/upload', { // Ensure this matches your API route
              method: 'POST',
              body: formData,
          });

          if (response.ok) {
              const result = await response.json();
              alert(`Image uploaded successfully! Path: ${result.filePath}`);
          } else {
              alert('Error uploading image.');
          }
      } catch (error) {
          console.error('Error uploading image:', error);
          alert('Error uploading image.');
      }
  };

  return (
    <div>
      <Head>
        <title>My Next.js App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h2>FireSight</h2>
        {/* <nav>
          <ul>
            <li><a href="#">Link 1</a></li>
            <li><a href="#">Link 2</a></li>
            <li><a href="#">Link 3</a></li>
          </ul>
        </nav> */}
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.mapContainer}>
            <iframe title="map" src="/map.html" width="100%" height="100%" style={{ border: '1px solid #ccc'}}></iframe>
          </div>

          <div className={styles.controls}>
            <h3>Enter something here</h3>
            <form onSubmit={handleSubmit} style={{ all: 'inherit' }}>
              <input type="text" placeholder="Text Input 1" className={styles.inputField} required value={textInput1} onChange={(e) => setTextInput1(e.target.value)} />
              <input type="text" placeholder="Text Input 2" className={styles.inputField} value={textInput2} onChange={(e) => setTextInput2(e.target.value)} />

              <div className={styles.sliderRow}>
                <p>Slider 1</p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={slider1Value}
                  onChange={handleSlider1Change}
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
                  onChange={handleSlider2Change}
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
                  onChange={handleSlider3Change}
                  className={styles.slider}
                />
                <div className={styles.sliderValue}>{slider3Value}</div>
              </div>

              <div className={styles.sliderRow}>
                <p>Min</p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={slider4Value}
                  onChange={handleSlider4Change}
                  className={styles.slider}
                />
                <div className={styles.sliderValue}>{/* slider4Value */} <p>Max</p> </div>
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
              {/* The button will take a snapshot of all the input values and add them to a CSV */}
            </form>
            <div className={styles.uploadButton} onClick={() => fileInputRef.current?.click()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 4v14" />
                </svg>
                <label style={{ padding: '5px' }}>Upload Image</label>
                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                />
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