import './App.css'
import { useEffect } from 'react'
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

  const onSuccess = (res) => {
    console.log('login ok with the email', res.profileObj.email);

    fetch('https://script.google.com/macros/s/AKfycbybvg2o-3fwCyT52Ozme1U-FCNQDh5RbFO6_9POTe7PMEBX7y77AjYo9CniFjQCmRjC0w/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `correo=${encodeURIComponent(res.profileObj.email)}`,
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      if (data && data.redireccion) {
        window.location.href = data.redireccion; // Redirige al usuario a la URL
      }
    })
    .catch((error) => {
      console.error('Error:', error);
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
      <h2>Bienvenido a Sir Abaco</h2>
      <div className="login-button">
        <GoogleLogin
          clientId={clientId}
          buttonText='Iniciar sesión'
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={'single_host_origin'}
        />
      </div>
    </>
  )
}

export default App;
