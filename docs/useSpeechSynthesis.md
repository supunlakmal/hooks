# useSpeechSynthesis

Leverages the browser's Speech Synthesis API (Text-to-Speech).

This hook provides functionality to speak text aloud, cancel ongoing speech, list available voices, and track the speaking status and potential errors. It also checks if the API is supported by the browser.

## Usage

```jsx
import React, { useState } from 'react';
import { useSpeechSynthesis } from '@supunlakmal/hooks'; // Adjust import path

function TextToSpeechComponent() {
  const [textToSpeak, setTextToSpeak] = useState('Hello, world! This is a test.');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const { isSupported, voices, speaking, speak, cancel, error } = useSpeechSynthesis();

  // Select the first available US English voice by default
  useState(() => {
    if (voices.length > 0 && !selectedVoice) {
      const defaultVoice = voices.find(voice => voice.lang === 'en-US');
      setSelectedVoice(defaultVoice || voices[0]);
    }
  }, [voices, selectedVoice]);

  const handleSpeak = () => {
    speak(textToSpeak, {
      voice: selectedVoice || undefined,
      // Optional: Adjust pitch, rate, volume
      // pitch: 1.2,
      // rate: 0.9,
      // volume: 0.8,
    });
  };

  if (!isSupported) {
    return <p>Sorry, your browser does not support speech synthesis.</p>;
  }

  return (
    <div>
      <h2>Text-to-Speech</h2>
      <textarea
        value={textToSpeak}
        onChange={(e) => setTextToSpeak(e.target.value)}
        rows={4}
        cols={50}
        disabled={speaking}
      />
      <br />

      <label htmlFor="voice-select">Select Voice:</label>
      <select
        id="voice-select"
        value={selectedVoice?.name || ''}
        onChange={(e) => {
          const voice = voices.find(v => v.name === e.target.value);
          setSelectedVoice(voice || null);
        }}
        disabled={speaking || voices.length === 0}
      >
        {voices.length === 0 && <option>Loading voices...</option>}
        {voices.map((voice) => (
          <option key={voice.name} value={voice.name}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>
      <br />

      <button onClick={handleSpeak} disabled={speaking || !textToSpeak}>
        {speaking ? 'Speaking...' : 'Speak'}
      </button>
      <button onClick={cancel} disabled={!speaking}>
        Cancel
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </div>
  );
}

export default TextToSpeechComponent;
```

## API

`useSpeechSynthesis()`

### Parameters

This hook takes no parameters.

### Returns

-   **`speechSynthesisState`**: `object`
    An object containing the speech synthesis state and control functions:
    -   `isSupported`: `boolean` - `true` if the Speech Synthesis API is supported by the browser, `false` otherwise.
    -   `voices`: `SpeechSynthesisVoice[]` - An array of available `SpeechSynthesisVoice` objects. This list might populate asynchronously after the hook mounts.
    -   `speaking`: `boolean` - `true` if speech is currently in progress, `false` otherwise.
    -   `speak(text: string, options?: SpeechSynthesisOptions): void` - A function to initiate speech synthesis.
        -   `text`: The string of text to be spoken.
        -   `options?`: An optional object to configure the speech utterance:
            -   `lang?`: `string` - BCP 47 language tag (e.g., 'en-US', 'es-ES'). Defaults to the first voice's language or 'en-US'.
            -   `pitch?`: `number` - Speech pitch (0 to 2, default is 1).
            -   `rate?`: `number` - Speech rate (0.1 to 10, default is 1).
            -   `voice?`: `SpeechSynthesisVoice` - A specific voice object from the `voices` array to use.
            -   `volume?`: `number` - Speech volume (0 to 1, default is 1).
    -   `cancel(): void` - A function to immediately stop any currently ongoing speech.
    -   `error`: `Error | null` - An `Error` object if loading voices failed or if an error occurred during speech synthesis, otherwise `null`.
