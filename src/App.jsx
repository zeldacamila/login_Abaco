import './App.css'
import { useEffect, useState } from 'react'
import GoogleLogin from '@leecheuk/react-google-login'
import { gapi } from 'gapi-script'

const clientId = import.meta.env.VITE_CLIENT_ID;

function App() {

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: 'profile email'
      });
    };
    
    gapi.load('client:auth2', start);
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const onSuccess = (res) => {
    // Inicia la animación del loading
    setIsLoading(true);
    // Petición a 'API' para leer url a la que debe redireccionar según el correo
    fetch('https://script.google.com/macros/s/AKfycbybvg2o-3fwCyT52Ozme1U-FCNQDh5RbFO6_9POTe7PMEBX7y77AjYo9CniFjQCmRjC0w/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `correo=${encodeURIComponent(res.profileObj.email)}`,
    })
    .then(response => response.json())
    .then(data => {
      if (data && data.redireccion) {
        window.location.href = data.redireccion; // Redirige al usuario a la URL
      }
      setIsLoading(false)
    })
    .catch((error) => {
      setIsLoading(false)
    });
  };
  
  const onFailure = (res) => {
    console.log('login failed', res)
  };

  return (
    <>
      <div>
          <img src="https://cafa.iphiview.com/cafa/API/Organizations/GetLogo?partyId=306219" className="logo" alt="Abaco logo" />
      </div>
      <h1>Bienvenido a Sir Abaco</h1>
      <div className="login-button">
        {isLoading? (
          <div className="spinner"></div>
        ): (
          <GoogleLogin
          clientId={clientId}
          buttonText='Iniciar sesión'
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={'single_host_origin'}
          // isSignedIn={true}
        />
        )}
      </div>
    </>
  )
}

export default App;
