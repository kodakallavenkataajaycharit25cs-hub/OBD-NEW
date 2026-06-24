export function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const scriptId = 'google-maps-script';
    const existingScript = document.getElementById(scriptId);

    // If script already exists and has the correct key, resolve immediately
    if (existingScript) {
      const src = existingScript.getAttribute('src') || '';
      if (src.includes(`key=${apiKey}`)) {
        resolve();
        return;
      }
      // If key is different, remove the old script
      existingScript.remove();
      const win = window as any;
      if (win.google) {
        delete win.google;
      }
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
}
