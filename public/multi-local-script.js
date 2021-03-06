async function onSignIn(googleUser) {
  //console.log("LOGIN DE GOOOGLEEEEEEEEEE");
  var profile = googleUser.getBasicProfile();

  if (!profile) return;
  //console.log("LOGIN DE GOOOGLEEEEEEEEEE: ", profile);

  const usuarioCorreo = profile.getEmail();
  var auth2 = gapi.auth2.getAuthInstance();
  await auth2.signOut();
  // Si aun no estoy logueado
  //if (!sessionStorage.getItem("Sesion")) {
  let usuarioLogueado = await fetch("/api/usuario/" + usuarioCorreo, {
    method: "GET",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  let responseJson = await usuarioLogueado.json();
  if (responseJson.error) {
    ////console.log("Error GMAIIIILLLL");
    const inputElement = document.getElementById("AlertGmail");
    //console.log("Error inputElementL",inputElement);
    
    if (inputElement) {
      //console.log("Error GMAIIIILLLL");
      inputElement.click();
    }
    return;
  }
  //console.log("google obtains: ", responseJson);
  sessionStorage.setItem("Sesion", JSON.stringify(responseJson));
  window.location.replace("./" + responseJson.rol.toLowerCase());
}
